import React, { useEffect, useState } from 'react';
import { useSearchParams } from "react-router-dom";
import PostCard from "../components/PostCard";
import Navbar from "../components/Navbar";
import BottomBar from '../components/Bottombar';
import { useGetPostsByUserQuery } from '../redux/posts/postApi';
import { useNavigate } from "react-router-dom";
import InfiniteScroll from 'react-infinite-scroll-component';
import { BadgeCheck } from 'lucide-react';

function UserPage() {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");
  const navigate = useNavigate();
  
  const [userPosts, setUserPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  
  const { data: postsData, error, isLoading } = useGetPostsByUserQuery({ 
    page, 
    limit: 6, 
    userId: userId 
  }, {
    refetchOnWindowFocus: false,
  });
  
  useEffect(() => {
    if (postsData && postsData.posts) {
      setUserPosts((prevPosts) => {
        const postMap = new Map(prevPosts.map(post => [post.postId, post]));
        
        postsData.posts.forEach(post => {
          postMap.set(post.postId, post);  // This will ensure uniqueness by postId
        });
  
        const sortedPosts = Array.from(postMap.values()).sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        
        return sortedPosts;
      });
  
      setHasMore(postsData.hasMore);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [postsData]);
  
  const fetchMorePosts = () => {
    if (hasMore) {
      setLoading(true);
      setTimeout(() => {
        setPage((prevPage) => prevPage + 1);
        setLoading(false);
      }, 2000);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-white mb-[120px] font-inter">
      <Navbar />
      <div className='flex flex-col w-full md:w-1/2 items-center'>
        {userPosts.length > 0 && (
          <>
            <img src={userPosts[0].profilePicture} className='h-50 w-48' alt="Profile" />
            <div className='flex gap-1'>
              <p className="text-base md:text-lg font-bold text-gray-800 bg-[#FAF4FE] p-1 rounded-md">
                {userPosts[0].year}-{parseInt(userPosts[0].year) + 4}
              </p>
            </div>
            {userPosts[0].isAuthenticated && (
                <div className="w-full p-3 text-[#4b6cfcec] flex items-center justify-center gap-2">
                        <span><BadgeCheck className='w-5 text-[#4b6cfcec]'/></span>
                        <span>ID card is verified</span>
                      </div>
              )}
            <h1 className="text-2xl md:text-4xl font-bold my-4">
              Posts by {userPosts[0].gender} from {userPosts[0].section}
            </h1>
          </>
        )}
        
        <div className='flex flex-col w-full'>
          <InfiniteScroll
            dataLength={userPosts.length}
            next={fetchMorePosts}
            hasMore={hasMore}
            loader={loading && (
              <div className="flex justify-center items-center py-4">
                <div className="loader border-t-4 border-blue-600 rounded-full w-12 h-12 animate-spin"></div>
              </div>
            )}
            endMessage={<div className="text-center py-4">No more posts</div>}
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
              isLoading ? <div className="loader">Loading...</div> : <div>This user has no posts yet.</div>
            )}
          </InfiniteScroll>
        </div>
      </div>
      {error && <div className="text-red-500">Error: {error?.message}</div>}
      <BottomBar />
    </div>
  );
}

export default UserPage;