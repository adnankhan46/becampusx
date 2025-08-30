import {BadgeCheck} from 'lucide-react'
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDeletePostsMutation } from '../redux/posts/postApi';
import PropTypes from 'prop-types';

// PropTypes are defined here with required and non required fields
const PostCard = ({ text, gender, section, profilePicture, postImage, time, postId, postUser, commentCount, year, isAuthenticated }) => {
  const navigate = useNavigate(); 
  const {currentUser} = useSelector((state)=> state.user);
  const location = useLocation();
  const [deletePosts] = useDeletePostsMutation();
  const handleDeletePost = async (e)=>{
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this post?')) {
    try {
      await deletePosts(postId).unwrap();
       (location.pathname === `/post/${postId}`) && navigate("/home");
      console.log("Post Deletion Success");
    } catch (error) {
      console.log('Failed to delete:', error);
      console.log('Failed to delete. Please try again.');
    } }


  }

  return (
    <div className="overflow-x-hidden bg-white border border-[#D9D9D9] p-4 rounded-xl mb-2 w-full font-inter
    " onClick={()=>navigate(`/post/${postId}`)}>
      <div className="mb-1">
        <p className='text-sm md:text-base'>{text}</p>
        {postImage && <img className='rounded-lg border border-[#D9D9D9]' src={postImage} alt="postImg" onError={(e) => e.target.style.display = 'none'}/>}
      </div>
      <div className="flex gap-1 items-end relative">
        <div></div>
        <img src={profilePicture} className="h-6 w-6 cursor-pointer" alt="profilePicture" onClick={(e)=>{e.stopPropagation(); navigate(`/user/?userId=${postUser}`)}} />
        <p className="mt-6 text-black text-sm cursor-pointer"
           onClick={(e)=>{e.stopPropagation(); navigate(`/user/?userId=${postUser}`)}}
        ><b>{gender}</b> From <b>{section}</b></p>
       {/* ****** TODO: AUTH -> if OCR scanned id card admission no. === entered admission number, then Verify */}
        {(isAuthenticated) &&
        <span><BadgeCheck className='w-4 pt-1 text-[#4b6cfcec]'/></span>}
        <p className='absolute right-0 text-sm cursor-pointer'
           >{time}</p>
      </div>
      
      <div className="flex items-center justify-between mt-4">
   
      {(currentUser?._id === postUser) ?
      <p className="text-base text-red-500 cursor-pointer" onClick={handleDeletePost}>Delete</p>
      : <span className='text-sm bg-[#FAF4FE] p-1 text-gray-800 rounded-md'>{year}-{(parseInt(year, 10)+4)}</span>
        }
    
        <p className="text-base text-[#4b6cfcec] cursor-pointer">
        {(commentCount > 0) ? `${commentCount} Comments` : "Show Comments" }
        </p>
      </div>
       
    </div>
  );
};

PostCard.propTypes = {
  text: PropTypes.string,
  gender: PropTypes.string,
  section: PropTypes.string,
  profilePicture: PropTypes.string,
  postImage: PropTypes.string,
  time: PropTypes.string,
  postId: PropTypes.string.isRequired,
  postUser: PropTypes.string.isRequired,
  commentCount: PropTypes.number,
  year: PropTypes.string,
  isAuthenticated: PropTypes.bool,
};

export default PostCard;
