import { Server } from 'socket.io';
import Notification from './model/notification.model.js';
import dotenv from "dotenv";

dotenv.config();

const users = {}; // Store userId and socketId mappings

const allowedFrontendOrigin = ['http://localhost:5174', process.env.FRONTEND_ORIGIN]

const setupSocket = (httpserver) => {
  const io = new Server(httpserver, {
    cors: {
      origin: ['http://localhost:5173', allowedFrontendOrigin],  
      credentials: true,
      methods: ['GET', 'POST']   
    }
  });

  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);

    // Register the user
    socket.on('register', (userId) => {
      if (!userId) {
        console.error('Register event received without userId:', socket.id);
        return;
      }
      users[userId] = socket.id;  
      console.log(`User registered: '${userId}' with socket id: [${socket.id}]`);
    });

    
    socket.on('newComment', async (data) => {
      console.log('New comment received:', data);
      
      
      const { postOwnerId, comment, postId } = data;
        if (!postOwnerId || !comment || !postId) {
        console.error('Invalid data received for newComment:', data);
        return;
      }

      const postOwnerSocketId = users[postOwnerId];

      // Create and save the notification to the database
  const notification = new Notification({
    from: comment.userId,
    to: postOwnerId,
    notificationType: 'comment',
    text: `${comment.text}`,
    postId: postId,
    isRead: false,
  });

  await notification.save();

// Emiting real-time notification if the post owner is online
      if (postOwnerSocketId) {
        io.to(postOwnerSocketId).emit('notification', {
          message: `New comment: ${comment.userGender} from Section ${comment.userSection} "${comment.text}"`,
          postId: postId,
        });
        console.log(`Notified post owner (${postOwnerId}) about the new comment.`);
      } else {
        console.log(`Post owner (${postOwnerId}) is not connected or registered.`);
      }
    });

     
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);

       
      for (const userId in users) {
        if (users[userId] === socket.id) {
          delete users[userId];
          console.log(`User ${userId} removed from connected users.`);
          break;
        }
      }
    });
  });
}

export default setupSocket;
