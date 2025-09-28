// backend/api/controller/Admin/supervisorAdmin.controller.js
import mongoose from "mongoose";
import Supervisor from "../../model/supervisor.model.js";
import Submission from "../../model/submission.model.js";
import User from "../../model/user.model.js";
import Opportunity from "../../model/opportunity.model.js";
import { errorHandler } from "../../middlewares/error.js";

// Create supervisor
export const createSupervisor = async (req, res, next) => {
  try {
    const { userId, name, email, department, expertise } = req.body;
    
    if (!userId || !name || !email) {
      return next(errorHandler(400, "UserId, name, and email are required"));
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }
    
    const existingSupervisor = await Supervisor.findOne({ userId });
    if (existingSupervisor) {
      return next(errorHandler(400, "User is already a supervisor"));
    }
    
    const supervisor = new Supervisor({
      userId,
      name,
      email,
      department: department || null,
      expertise: expertise || []
    });
    
    await supervisor.save();
    
    res.status(201).json({ 
      message: "Supervisor created successfully", 
      supervisor 
    });
  } catch (error) {
    next(error);
  }
};

// Assign student to supervisor
export const assignStudentToSupervisor = async (req, res, next) => {
  try {
    const { supervisorId, studentId, opportunityId } = req.body;
    
    if (!supervisorId || !studentId || !opportunityId) {
      return next(errorHandler(400, "SupervisorId, studentId, and opportunityId are required"));
    }
    
    const supervisor = await Supervisor.findById(supervisorId);
    const student = await User.findById(studentId);
    const opportunity = await Opportunity.findById(opportunityId);
    
    if (!supervisor || !student || !opportunity) {
      return next(errorHandler(404, "Supervisor, student, or opportunity not found"));
    }
    
    const existingAssignment = supervisor.assignedStudents.find(
      assignment => assignment.studentId.toString() === studentId && 
                   assignment.opportunityId.toString() === opportunityId
    );
    
    if (existingAssignment) {
      return next(errorHandler(400, "Student already assigned to this supervisor for this opportunity"));
    }
    
    supervisor.assignedStudents.push({
      studentId,
      opportunityId,
      status: 'assigned'
    });
    
    await supervisor.save();
    
    const submission = new Submission({
      studentId,
      opportunityId,
      supervisorId,
      status: 'pending'
    });
    
    await submission.save();
    
    res.status(200).json({ 
      message: "Student assigned to supervisor successfully", 
      assignment: { studentId, opportunityId, supervisorId }
    });
  } catch (error) {
    next(error);
  }
};

// Get all supervisors
export const getAllSupervisors = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    
    const supervisors = await Supervisor.find()
      .populate('userId', 'username email')
      .populate('assignedStudents.studentId', 'username email')
      .populate('assignedStudents.opportunityId', 'title')
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);
    
    const totalSupervisors = await Supervisor.countDocuments();
    const hasMore = (pageNumber * limitNumber) < totalSupervisors;
    
    res.status(200).json({
      supervisors,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalSupervisors / limitNumber),
      hasMore,
      totalCount: totalSupervisors
    });
  } catch (error) {
    next(error);
  }
};

// Get all submissions (for admin overview)
export const getAllSubmissions = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    
    let query = {};
    if (status) {
      query.status = status;
    }
    
    const submissions = await Submission.find(query)
      .populate('studentId', 'username email admissionNumber')
      .populate('opportunityId', 'title description amount')
      .populate('supervisorId', 'name email department')
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);
    
    const totalSubmissions = await Submission.countDocuments(query);
    const hasMore = (pageNumber * limitNumber) < totalSubmissions;
    
    res.status(200).json({
      submissions,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalSubmissions / limitNumber),
      hasMore,
      totalCount: totalSubmissions
    });
  } catch (error) {
    next(error);
  }
};

// Remove supervisor
export const removeSupervisor = async (req, res, next) => {
  try {
    const { supervisorId } = req.params;
    
    const supervisor = await Supervisor.findById(supervisorId);
    if (!supervisor) {
      return next(errorHandler(404, "Supervisor not found"));
    }
    
    const pendingSubmissions = await Submission.countDocuments({
      supervisorId,
      status: { $in: ['pending', 'submitted'] }
    });
    
    if (pendingSubmissions > 0) {
      return next(errorHandler(400, "Cannot remove supervisor with pending submissions"));
    }
    
    await Supervisor.findByIdAndDelete(supervisorId);
    
    res.status(200).json({ message: "Supervisor removed successfully" });
  } catch (error) {
    next(error);
  }
};

// Update supervisor status
export const updateSupervisorStatus = async (req, res, next) => {
  try {
    const { supervisorId } = req.params;
    const { isActive } = req.body;
    
    const supervisor = await Supervisor.findByIdAndUpdate(
      supervisorId,
      { isActive },
      { new: true }
    );
    
    if (!supervisor) {
      return next(errorHandler(404, "Supervisor not found"));
    }
    
    res.status(200).json({ 
      message: "Supervisor status updated successfully", 
      supervisor 
    });
  } catch (error) {
    next(error);
  }
};