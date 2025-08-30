import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { addComment, deleteComment, getAllCommentByPost } from "../controller/comment.controller.js";


const router = express.Router();

router.get("/all/:postId", getAllCommentByPost);
router.post("/add/:postId", addComment);
router.post("/delete/:commentId", deleteComment);



export default router;