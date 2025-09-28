import express from "express";
import { verifyToken, verifyAdmin } from "../middlewares/auth.js";
import {
  getProfile,
  updateProfile,
  addSkills,
  updateSkills,
  removeSkill,
  updateResume,
  addOpportunityHistory,
  updateOpportunityHistory,
  removeOpportunityHistory,
  getAllProfiles
} from "../controller/studentProfile.controller.js";

const router = express.Router();

/**
 * Student Profile Routes
 * BASE_URL = /api/student-profile
 */

// Auth middleware
router.use(verifyToken);

// GET PROFILE
router.get("/:userId", getProfile);

// UPDATE BASIC PROFILE
router.put("/:userId", updateProfile);

// SKILLS MANAGEMENT
router.post("/:userId/skills", addSkills);
router.put("/:userId/skills", updateSkills);
router.delete("/:userId/skills", removeSkill);

// RESUME MANAGEMENT
router.put("/:userId/resume", updateResume);

// OPPORTUNITY HISTORY MANAGEMENT
router.post("/:userId/opportunity-history", addOpportunityHistory);
router.put("/:userId/opportunity-history/:historyId", updateOpportunityHistory);
router.delete("/:userId/opportunity-history/:historyId", removeOpportunityHistory);

// ADMIN ROUTES
router.get("/admin/all-profiles", verifyAdmin, getAllProfiles);

export default router;