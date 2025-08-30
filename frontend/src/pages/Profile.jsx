import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PostCard from '../components/PostCard';
import BottomBar from '../components/Bottombar';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { useGetPostsByUserQuery } from '../redux/posts/postApi';
import { useUpdatePasswordMutation, useLogoutMutation } from '../redux/apiSlice';
import { setCurrentUser } from '../redux/user/userSlice';
import InfiniteScroll from 'react-infinite-scroll-component';
import { BadgeCheck } from 'lucide-react';
import IDCardVerification from '../components/IDCardVerification'; // Import the new component

const Profile = () => {
  const [logout] = useLogoutMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [password, setPassword] = useState('');
  const [updatePassword, { isLoading: isUpdating, error: updateError }] = useUpdatePasswordMutation();

  const { currentUser } = useSelector((state) => state.user);
  const [page, setPage] = useState(1);
  const { data: postsData } = useGetPostsByUserQuery({ page, limit: 6, userId: currentUser._id });

  const userPosts = postsData ? postsData.posts : [];

  const fetchMorePosts = () => {
    if (postsData && postsData.hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!password) {
      alert('Please enter a new password');
      return;
    }

    try {
      const result = await updatePassword({ password }).unwrap();
      alert('Password updated successfully:', result);
    } catch (error) {
      alert('Failed to update password:', error);
    }
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await logout().unwrap();
      dispatch(setCurrentUser(null));
      localStorage.removeItem('persist:root');
      localStorage.removeItem('nsfwModelLoaded');
      navigate("/login");
      console.log("LogOut Success");
    } catch (error) {
      console.error('Failed to logout:', error);
      alert('Failed to logout. Please try again.');
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-white mb-[120px] font-inter">
      <Navbar />
      <div className='flex flex-col w-full md:w-1/2 items-center'>
        <img src={currentUser.profilePicture} className='h-50 w-48' alt="Profile" />
        <h1 className="text-2xl md:text-4xl font-bold mb-2">{currentUser.admissionNumber}</h1>
        <div className='flex gap-1 items-center'>
          <p className="text-base md:text-lg font-bold text-gray-800 bg-[#FAF4FE] p-1 rounded-md">{currentUser?.year}-{parseInt((currentUser?.year))+4}</p>
          {(currentUser.isAuthenticated) &&
          <span><BadgeCheck className='w-6 text-[#4b6cfcec]'/></span>}
        </div>
        
        {/* Add the ID Card Verification component */}
        <IDCardVerification />
        
        <input className="w-full p-2 mb-2 border rounded-xl bg-[#eeeeee] focus:outline-none" type="text" placeholder="Username" value={currentUser.username} readOnly />
        <input className="w-full p-2 mb-2 border rounded-xl bg-[#eeeeee] focus:outline-none" type="email" placeholder="Email" value={currentUser.email} readOnly />
        <input className="w-full p-2 mb-2 border rounded-xl bg-[#eeeeee] focus:outline-none" type="password" placeholder="New Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <p className='text-xs text-start'>NOTE: Passwords are hashed and then stored. You can change it here.</p>
        <div className='flex gap-6'>
          <button className="mt-4 p-3 bg-[#ffffff] border-2 border-[#D9D9D9] font-bold text-[#6a7cff] rounded-xl" onClick={handleUpdate} disabled={isUpdating}>
            {isUpdating ? 'Updating...' : 'Change Password'}
          </button>
          <button className="mt-4 p-3 bg-[#ffffff] border-2 border-[#D9D9D9] text-[#6a7cff] font-bold rounded-xl" onClick={handleLogout}>Logout</button>
        </div>
        {updateError && <div className="text-red-500">Error: {updateError.data?.message || 'Failed to update password.'}</div>}
        <h1 className="text-2xl md:text-4xl font-bold my-4">My Posts</h1>
        <div className='flex flex-col w-full'>
          <InfiniteScroll
            dataLength={userPosts.length}
            next={fetchMorePosts}
            hasMore={postsData && postsData.hasMore}
            loader={<div>Loading more posts...</div>}
            endMessage={<div> </div>}
          >
            {userPosts.length > 0 ? (
              userPosts.map((post) => (
                <PostCard
                  key={post.postId}
                  text={post.text}
                  section={post.section}
                  gender={post.gender}
                  profilePicture={post.profilePicture}
                  postImage={post.postImage}
                  time={new Date(post.createdAt).toLocaleString()}
                  postId={post.postId}
                  postUser={post.user}
                  year={post.year}
                />
              ))
            ) : (
              <div>You have no posts yet.</div>
            )}
          </InfiniteScroll>
        </div>
      </div>
      <BottomBar />
    </div>
  );
};

export default Profile;