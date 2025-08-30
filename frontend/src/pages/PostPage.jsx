import React, { useEffect } from 'react';
import PostCard from '../components/PostCard';
import Navbar from '../components/Navbar';
import BottomBar from '../components/Bottombar';
// import Comment from '../components/Comment';
import CommentSection from '../components/CommentSection';
import { useGetSinglePostQuery } from '../redux/posts/postApi';
import { useParams } from 'react-router-dom';
import { useGetCommentAllPostQuery } from '../redux/posts/postApi';


const PostPage = () => {
  const {postId} = useParams();
  const { data: post, error, isLoading } = useGetSinglePostQuery(postId);

  const {data: comments = [], error: commentError, isLoading: commentLoading} = useGetCommentAllPostQuery(postId);

  // Scroll to the top of the page when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div className="flex flex-col items-center min-h-screen bg-[#FAF4FE] mb-[120px]">
    <Navbar/>
    {console.log(post)}
    <div className='mt-2 flex flex-col w-full md:w-1/2 items-center'>
    {(isLoading) &&
      <PostCard
      key={"Loading"}
      text={"Loading"}
      section={"Loading"}
      gender={"Loading"}
      profilePicture={"Loading"}
      postImage={"Loading"}
      time={"Loading"}
      commentCount={0}
      year={"Loading"}
      />}

    {post ? <PostCard
   
          text={post.post.text}
          section={post.post.section}
          gender={post.post.gender}
          profilePicture={post.post.profilePicture}
          postImage={post.post.postImage}
          time={new Date(post.post.createdAt).toLocaleString()}
          postId={post.post.postId}
          postUser={post.post.user}
          commentCount={comments.length}
          year={post.post.year|| "year"}
          isAuthenticated={post.post.isAuthenticated}
    /> :  (
      isLoading ?
      <div>Loading...</div>
      : <div>No Posts</div>)}

      {/* Pass fetched comments to CommentSection */}
      <CommentSection
      comments={comments}
      commentLoading={commentLoading}
      commentError={commentError}
      postId={post?.post?.postId}
      CommentUserId={post?.post?.user}
      />
      {error && <div className="text-red-500">Error: {error.data.message}</div>}
    </div>

    {error && <div className="text-red-500">Error: {error.data.message}</div>}
    <BottomBar/>
    </div>
    
  )  
};

  

export default PostPage;

