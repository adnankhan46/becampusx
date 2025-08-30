import express from "express";
import { addPost, allPost, allPostByUser, checkHi, deletePost, getSinglePost } from "../controller/post.controller.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { postLimiter } from "../middlewares/rate-limiter.js";

const router = express.Router();

router.get("/checkhi", isAuthenticated, checkHi);
router.get("/allpost", isAuthenticated, allPost);
router.get("/allpostbyuser", isAuthenticated, allPostByUser);
router.get("/:postId", isAuthenticated, getSinglePost); // doing

router.post("/addpost", postLimiter, isAuthenticated, addPost);
router.post("/delete/:postId", isAuthenticated, deletePost);




export default router;