// src/pages/Notification.js
import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import BottomBar from '../components/Bottombar';
import { useSelector } from 'react-redux';
import { useFetchNotificationsQuery, useClearNotificationsMutation } from '../redux/notification/notifApi';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000', { autoConnect: false });

function Notification() {
  const { currentUser } = useSelector((state) => state.user);
  const { data: notifications = [], refetch } = useFetchNotificationsQuery(currentUser?._id, { skip: !currentUser });
  const [clearNotifications] = useClearNotificationsMutation();
  const [newNotifications, setNewNotifications] = useState([]);

  useEffect(() => {
    if (!currentUser) return;

    // Connect to socket for real-time notifications
    socket.connect();
    socket.emit('register', currentUser._id);

    socket.on('notification', (data) => {
      const timestamp = new Date().toLocaleString();
      setNewNotifications((prev) => [...prev, { ...data, timestamp }]);
    });

    return () => {
      socket.disconnect();
    };
  }, [currentUser]);

  const handleClearNotifications = async () => {
    try {
      await clearNotifications(currentUser._id).unwrap();
      refetch(); // Refetch notifications after clearing
    } catch (err) {
      console.error('Error clearing notifications:', err);
    }
  };

  const combinedNotifications = [...notifications, ...newNotifications];

  return (
    <div className='overflow-x-hidden flex flex-col items-center min-h-screen font-inter bg-white mb-[120px]'>
      <Navbar />
      <div className="flex w-full md:w-1/2 justify-center items-center relative">
      <p className="text-2xl md:text-4xl font-bold mt-2">All Notifications</p>
      {combinedNotifications.length === 0 ?
        ""
        :
        <button
        onClick={handleClearNotifications}
        className='absolute right-0 mr-2 mt-2 px-2 py-1 text-red-500 text-base md:text-base'>
        Clear All
        </button>
        }
        </div>

      <div className='mt-4 flex flex-col w-full md:w-1/2 items-center h-full px-2'>
        <div className='border border-gray-300 rounded-lg w-full p-4'>
          {combinedNotifications.length === 0 ? (
            <p className="text-center">You have no notifications yet</p>
          ) : (
            <ul className='w-full text-left'>
              {combinedNotifications.reverse().map((notification, index) => (
                <li key={index} className='border-b border-gray-200 py-2'>
                   {/* Display 'text' if it exists, otherwise fall back to 'message' */}
    <p className='text-[#6a7cff] font-bold'>New {notification.notificationType || ''}</p> 
    <p>{notification.text || notification.message || 'No message available'}</p> 
    <p className="text-gray-500 text-sm">{`${notification.from?.gender} from Section ${notification.from?.section}`}</p>
                  <p className="text-gray-500 text-sm">{`Post ID: ${notification.postId}`}</p>
                  <p className="text-gray-400 text-xs">{notification.timestamp || notification.createdAt || "Null timestamp"}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>


      <BottomBar />
    </div>
  );
}

export default Notification;
