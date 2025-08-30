import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { allnotif, deletenotif } from "../controller/notification.controller.js";


const router = express.Router();

router.get("/allnotif/:userId", allnotif);
router.post("/deletenotif/:userId", deletenotif);



export default router;