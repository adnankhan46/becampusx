// backend/api/controller/supervisor.controller.js
import mongoose from "mongoose";
import Supervisor from "../model/supervisor.model.js";
import Submission from "../model/submission.model.js";
import StudentProfile from "../model/StudentProfile.model.js";
import User from "../model/user.model.js";
import Opportunity from "../model/opportunity.model.js";
import { errorHandler } from "../middlewares/error.js";

// Get supervisor profile
export const getSupervisorProfile = async (req, res, next) => {
  try {
    const supervisorId = req.user.id;
    
    const supervisor = await Supervisor.findOne({ userId: supervisorId })
      .populate('assignedStudents.studentId', 'username email')
      .populate('assignedStudents.opportunityId', 'title description');
    
    if (!supervisor) {
      return res.status(404).json({ message: "Supervisor profile not found" });
    }
    
    res.status(200).json(supervisor);
  } catch (error) {
    next(error);
  }
};

// Get assigned students with their submissions
export const getAssignedStudents = async (req, res, next) => {
  try {
    const supervisorId = req.user.id;
    const { page = 1, limit = 10 } = req.query;
    
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    
    const supervisor = await Supervisor.findOne({ userId: supervisorId });
    if (!supervisor) {
      return next(errorHandler(404, "Supervisor not found"));
    }
    
    const submissions = await Submission.find({ supervisorId: supervisor._id })
      .populate('studentId', 'username email admissionNumber')
      .populate('opportunityId', 'title description amount')
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);
    
    const totalSubmissions = await Submission.countDocuments({ supervisorId: supervisor._id });
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

// Get specific submission details
export const getSubmissionDetails = async (req, res, next) => {
  try {
    const { submissionId } = req.params;
    const supervisorId = req.user.id;
    
    const supervisor = await Supervisor.findOne({ userId: supervisorId });
    if (!supervisor) {
      return next(errorHandler(404, "Supervisor not found"));
    }
    
    const submission = await Submission.findOne({ 
      _id: submissionId, 
      supervisorId: supervisor._id 
    })
      .populate('studentId', 'username email admissionNumber profile')
      .populate('opportunityId', 'title description amount deadline');
    
    if (!submission) {
      return next(errorHandler(404, "Submission not found"));
    }
    
    res.status(200).json(submission);
  } catch (error) {
    next(error);
  }
};

// Provide feedback to student submission
export const provideFeedback = async (req, res, next) => {
  try {
    const { submissionId } = req.params;
    const { rating, skills, attendance, remarks, recommendation } = req.body;
    const supervisorId = req.user.id;
    
    if (!rating || !attendance || !remarks || recommendation === undefined) {
      return next(errorHandler(400, "Rating, attendance, remarks, and recommendation are required"));
    }
    
    const supervisor = await Supervisor.findOne({ userId: supervisorId });
    if (!supervisor) {
      return next(errorHandler(404, "Supervisor not found"));
    }
    
    const submission = await Submission.findOneAndUpdate(
      { _id: submissionId, supervisorId: supervisor._id },
      {
        $set: {
          'feedback.rating': rating,
          'feedback.skills': skills || [],
          'feedback.attendance': attendance,
          'feedback.remarks': remarks,
          'feedback.recommendation': recommendation,
          'feedback.feedbackGivenAt': new Date(),
          status: 'feedback_given'
        }
      },
      { new: true }
    ).populate('studentId', 'username email')
     .populate('opportunityId', 'title');
    
    if (!submission) {
      return next(errorHandler(404, "Submission not found"));
    }
    
    if (recommendation) {
      await StudentProfile.findOneAndUpdate(
        { 
          userId: submission.studentId._id,
          "opportunityHistory.opportunityId": submission.opportunityId._id
        },
        { 
          $set: { 
            "opportunityHistory.$.status": 'approved',
            "opportunityHistory.$.endDate": new Date(),
            "opportunityHistory.$.description": `Completed with ${rating} rating - ${remarks}`,
            "opportunityHistory.$.certificate": "certificate_url_here",
            updatedAt: new Date()
          }
        }
      );
      
      submission.certificateGenerated = true;
      submission.status = 'approved';
      await submission.save();
    } else {
      submission.status = 'rejected';
      await submission.save();
    }
    
    res.status(200).json({ 
      message: "Feedback provided successfully", 
      submission 
    });
  } catch (error) {
    next(error);
  }
};

// Update supervisor profile
export const updateSupervisorProfile = async (req, res, next) => {
  try {
    const supervisorId = req.user.id;
    const { department, expertise } = req.body;
    
    const supervisor = await Supervisor.findOneAndUpdate(
      { userId: supervisorId },
      {
        $set: {
          department,
          expertise: expertise || []
        }
      },
      { new: true }
    );
    
    if (!supervisor) {
      return next(errorHandler(404, "Supervisor not found"));
    }
    
    res.status(200).json({ 
      message: "Profile updated successfully", 
      supervisor 
    });
  } catch (error) {
    next(error);
  }
};