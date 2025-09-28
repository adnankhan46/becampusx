// backend/api/route/supervisor.route.js
import express from "express";
import { verifyToken, verifyAdmin } from "../middlewares/auth.js";
import {
  getSupervisorProfile,
  getAssignedStudents,
  getSubmissionDetails,
  provideFeedback,
  updateSupervisorProfile
} from "../controller/supervisor.controller.js";
import {
  submitWork,
  getMySubmissions,
  getSubmissionStatus,
  updateSubmission
} from "../controller/studentSubmission.controller.js";
import {
  createSupervisor,
  assignStudentToSupervisor,
  getAllSupervisors,
  getAllSubmissions,
  removeSupervisor,
  updateSupervisorStatus
} from "../controller/Admin/supervisorAdmin.controller.js";

const router = express.Router();

// Auth middleware
router.use(verifyToken);

// STUDENT ROUTES - Submit work to supervisor
router.post("/submit/:opportunityId", submitWork);
router.get("/my-submissions", getMySubmissions);
router.get("/submission-status/:opportunityId", getSubmissionStatus);
router.put("/update-submission/:opportunityId", updateSubmission);

// SUPERVISOR ROUTES - View and manage submissions
router.get("/profile", getSupervisorProfile);
router.put("/profile", updateSupervisorProfile);
router.get("/assigned-students", getAssignedStudents);
router.get("/submission/:submissionId", getSubmissionDetails);
router.put("/feedback/:submissionId", provideFeedback);

// ADMIN ROUTES - Manage supervisors
router.post("/admin/create", verifyAdmin, createSupervisor);
router.post("/admin/assign", verifyAdmin, assignStudentToSupervisor);
router.get("/admin/all-supervisors", verifyAdmin, getAllSupervisors);
router.get("/admin/all-submissions", verifyAdmin, getAllSubmissions);
router.delete("/admin/remove/:supervisorId", verifyAdmin, removeSupervisor);
router.put("/admin/status/:supervisorId", verifyAdmin, updateSupervisorStatus);

export default router;