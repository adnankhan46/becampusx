import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate,  } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useDeleteCommentOfPostMutation } from '../redux/posts/postApi';

const Comment = ({ comment, PersonAddedComment }) => {
  const {postId} = useParams();

  const {currentUser} = useSelector((state)=> state.user);
  const [deleteComment, {error: deleteCommentError, isLoading: deleteCommentLoading}] = useDeleteCommentOfPostMutation();
  const commentId = comment._id;
  
  const handlePostDelete = async (e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this post?')) {
    try {
      await deleteComment({ commentId, commentText: { userId: currentUser?._id } }).unwrap();
      console.log("Delete Deletion Success");
    } catch (error) {
      console.log('Failed to delete:', error);
      console.log('Failed to delete. Please try again.');
    } }
  }
  
  return (
    <div className="border p-4 mb-2 rounded-xl">
      <span className="font-inter">{comment.text}</span>
      <div className="flex gap-1 items-end relative mt-2">
      <img src={comment.user.profilePicture} className="h-6 w-6 rounded-full" alt="profilePicture" />
      <p className="text-black text-sm"><b>{comment.user.gender}</b> From Section <b>{comment.user.section}</b></p>
      <p className="absolute right-0 text-sm cursor-pointer">{new Date(comment.createdAt).toLocaleString()}</p>
      </div>
      {(currentUser?._id === PersonAddedComment) ?
        <p
        className="text-base text-red-500 cursor-pointer mt-2 flex justify-end"
        onClick={handlePostDelete}
        >Delete</p>
        : <p>{' '}</p>
          }
    </div>
  );
};

export default Comment;