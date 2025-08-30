 import React, { useEffect, useState } from 'react';
import BottomBar from '../components/Bottombar';
import Navbar from '../components/Navbar';
import { useSelector } from 'react-redux';
import PostCard from '../components/PostCard';
import { useNavigate } from 'react-router-dom';
import { useGetPostsQuery } from '../redux/posts/postApi';
import InfiniteScroll from 'react-infinite-scroll-component';

function Home() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const { data, error, isLoading } = useGetPostsQuery({ page, limit: 6 }, {
    refetchOnWindowFocus: false,
  });
  useEffect(() => {
    if (!currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    if (data && data.posts) {
      setPosts((prevPosts) => {
        // Using Map to ensure unique postId
        const postMap = new Map(prevPosts.map(post => [post.postId, post]));
        
        data.posts.forEach(post => {
          postMap.set(post.postId, post);  // This will ensure uniqueness by postId
        });
  
        // Convert the Map back to an array and sort by createdAt (newest first)
        const sortedPosts = Array.from(postMap.values()).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        return sortedPosts;  // Return sorted posts (newest at the top)
      });
  
      setHasMore(data.hasMore);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [data]);
  

   
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
    <div className="overflow-x-hidden flex flex-col items-center min-h-screen bg-[#FAF4FE] mb-[120px]">
      <Navbar />
      <div className="  mt-4 flex flex-col w-full md:w-1/2">
        {/* InfiniteScroll component */}
        <InfiniteScroll
          dataLength={posts.length}
          next={fetchMorePosts}
          hasMore={hasMore}
          // loader={loading && <div className="loader">Loading...</div>}
          loader={loading && (
            <div className="flex justify-center items-center py-4">
              <div className="loader border-t-4 border-blue-600 rounded-full w-12 h-12 animate-spin"></div>
            </div>
          )}
          endMessage={<div className="text-center py-4">No more posts</div>}
          
        >
          {posts.length > 0 ? (
            posts.map((post) => (
              <PostCard
                key={post.postId} // Use unique postId as key
                text={post.text}
                section={post.section}
                gender={post.gender}
                profilePicture={post.profilePicture}
                isAuthenticated={post.isAuthenticated}
                postImage={post.postImage}
                time={new Date(post.createdAt).toLocaleString()}
                postId={post.postId}
                postUser={post.user}
                year={post.year}
              />
            ))
          ) : (
            isLoading ? <div className="loader">Loading...</div> : <div>No Posts</div>
          )}
        </InfiniteScroll>
      </div>
      {error && <div className="text-red-500">Error: {error?.message}</div>}
      <BottomBar />
    </div>
  );
}

export default Home;

 