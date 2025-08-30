import express from "express";
import { handleSignUp, handleSignIn, logout, updatePassword,updateAuthenticationStatus } from "../controller/auth.controller.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { ipLimiter } from "../middlewares/rate-limiter.js";

const router = express.Router();

router.post("/signup", ipLimiter ,handleSignUp);
router.post("/signin", ipLimiter, handleSignIn);
router.post("/updatepassword", updatePassword);
router.post("/logout", isAuthenticated, logout);
router.post('/update-authentication', updateAuthenticationStatus);
export default router;