// src/components/CommentSection.js
import React, { useEffect, useState } from 'react';
import { useAddCommentToPostMutation } from '../redux/posts/postApi';
import { useSelector } from 'react-redux';
import Comment from './Comment';
import { io } from 'socket.io-client' 


const socket = io('http://localhost:3000');
const CommentSection = ({ comments = [], commentLoading, commentError, postId, CommentUserId }) => {
  const [newCommentText, setNewCommentText] = useState('');
  const [addCommentToPost, { error: AddCommentError, isLoading: AddCommentLoading }] = useAddCommentToPostMutation();
  const { currentUser } = useSelector((state) => state.user);
  const PersonAddedComment  = CommentUserId;
  useEffect(() => {
    if (!currentUser) return;

    // Connect the socket if not already connected
    if (!socket.connected) {
      socket.connect();
    }

    // Handle socket connection
    socket.on('connect', () => {
      console.log("Socket connected:", socket.id);
      
      socket.emit('register', currentUser._id);
    });

    
    socket.on('notification', (data) => {
      console.log('Notification received in CommentSection:', data);
    });

    // Handle socket errors
    socket.on('connect_error', (err) => {
      console.error('Socket connection error in CommentSection:', err);
    });

   
    return () => {
      socket.off('connect');
      socket.off('notification');
     
    };
  }, [currentUser, postId]);

  const handleCommentSubmit = async () => {
    const text = newCommentText.trim();
    if (text) {
      try {
        // Add the comment to the post via mutation
        await addCommentToPost({ postId, commentText: { text, userId: currentUser?._id, postId } }).unwrap();
        setNewCommentText('');
        // Log the comment submission
        console.log('Submitting new comment:', { text, userId: currentUser?._id, postId, CommentUserId });
        console.log('post ownerId:', CommentUserId);
        
        // Emit the 'newComment' event to the server
        socket.emit('newComment', {
          postId: postId,
          comment: {
            text: text,
            userId: currentUser?._id,
            userGender: currentUser?.gender,
            userSection: currentUser?.section,
            postId,
            CommentUserId
          },
          postOwnerId: CommentUserId,
        });
        
       
        setNewCommentText('');
      } catch (error) {
        console.error('Failed to add comment:', error);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 border-black rounded-lg shadow-md w-full">
      <p className="mb-4 text-xl md:text-2xl text-gray-400">{(comments.length > 0) ? `${comments.length} Comments` : "No comments yet"}</p>

      <div className="mb-4 w-full flex border-2 border-black-500 rounded-xl items-center font-inter">
        <input
          className="w-full p-2 text-black font-inter rounded-lg mr-2 focus:outline-none"
          placeholder="Add a new comment..."
          value={newCommentText}
          onChange={(e) => setNewCommentText(e.target.value)}
        />
        <button
          className="h-full p-4 text-white text-lg rounded-xl bg-[#6a7cff]"
          onClick={handleCommentSubmit}
          
        >
         Add
        </button>
        {AddCommentError && <div className="text-red-500">Error: {AddCommentError.data.message}</div>}
      </div>

      
        {commentLoading ? (
          <p>Loading comments...</p>
        ) : (
          comments.map((comment) => (
            <Comment key={comment._id}
             comment={comment}
             PersonAddedComment={CommentUserId} />
          ))
        )}
      </div>
    
  );
};

export default CommentSection;
