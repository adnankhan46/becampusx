import Post from "../model/post.model.js";
import User from "../model/user.model.js";
import Comment from "../model/comment.model.js"
import mongoose from "mongoose";

export const getAllCommentByPost = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate('user', 'section gender profilePicture')
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


export const addComment = async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId);
     if (!post) {
       return res.status(404).json({ message: 'Post not found' });
     }

     const newComment = new Comment({
        text: req.body.text, 
        user: req.body.userId, // to change to req.user.id
       post: postId,
      });

     const savedComment = await newComment.save();
     res.status(201).json(savedComment);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


export const deleteComment = async (req, res) => {
  const { commentId } = req.params;
  const {userId} = req.body;

  // commentId is a valid ObjectId ?
   if (!mongoose.Types.ObjectId.isValid(commentId)) {
     return res.status(400).json({ message: 'Invalid Comment ID' });
   }

   try {
     const comment = await Comment.findById(commentId);

     if (!comment) {
       return res.status(404).json({ message: 'Comment not found' });
     }

     // is authorized
      if (comment.user.toString() !== userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

     await Comment.findByIdAndDelete(commentId);
     res.status(200).json({ message: 'Comment deleted successfully' });
   } catch (error) {
     res.status(500).json({ message: 'Server error'});
   }
};