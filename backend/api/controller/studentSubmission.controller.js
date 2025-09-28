// backend/api/controller/studentSubmission.controller.js
import mongoose from "mongoose";
import Submission from "../model/submission.model.js";
import Supervisor from "../model/supervisor.model.js";
import StudentProfile from "../model/StudentProfile.model.js";
import { errorHandler } from "../middlewares/error.js";

// Submit work to supervisor
export const submitWork = async (req, res, next) => {
  try {
    const { opportunityId } = req.params;
    const { description, pptUrl, reportUrl, additionalFiles } = req.body;
    const studentId = req.user.id;
    
    if (!description) {
      return next(errorHandler(400, "Description is required"));
    }
    
    const supervisor = await Supervisor.findOne({
      'assignedStudents.studentId': studentId,
      'assignedStudents.opportunityId': opportunityId
    });
    
    if (!supervisor) {
      return next(errorHandler(404, "No supervisor assigned for this opportunity"));
    }
    
    const existingSubmission = await Submission.findOne({
      studentId,
      opportunityId
    });
    
    if (existingSubmission && existingSubmission.status !== 'pending') {
      return next(errorHandler(400, "Submission already completed"));
    }
    
    const submissionData = {
      studentId,
      opportunityId,
      supervisorId: supervisor._id,
      submission: {
        description,
        pptUrl: pptUrl || null,
        reportUrl: reportUrl || null,
        additionalFiles: additionalFiles || []
      },
      status: 'submitted'
    };
    
    let submission;
    if (existingSubmission) {
      submission = await Submission.findByIdAndUpdate(
        existingSubmission._id,
        submissionData,
        { new: true }
      );
    } else {
      submission = new Submission(submissionData);
      await submission.save();
    }
    
    await Supervisor.findOneAndUpdate(
      {
        _id: supervisor._id,
        'assignedStudents.studentId': studentId,
        'assignedStudents.opportunityId': opportunityId
      },
      {
        $set: {
          'assignedStudents.$.status': 'submitted'
        }
      }
    );
    
    res.status(200).json({ 
      message: "Work submitted successfully", 
      submission 
    });
  } catch (error) {
    next(error);
  }
};

// Get student's submissions
export const getMySubmissions = async (req, res, next) => {
  try {
    const studentId = req.user.id;
    const { page = 1, limit = 10 } = req.query;
    
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    
    const submissions = await Submission.find({ studentId })
      .populate('opportunityId', 'title description amount')
      .populate('supervisorId', 'name email department')
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);
    
    const totalSubmissions = await Submission.countDocuments({ studentId });
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

// Get specific submission status and feedback
export const getSubmissionStatus = async (req, res, next) => {
  try {
    const { opportunityId } = req.params;
    const studentId = req.user.id;
    
    const submission = await Submission.findOne({
      studentId,
      opportunityId
    })
      .populate('opportunityId', 'title description')
      .populate('supervisorId', 'name email department');
    
    if (!submission) {
      return res.status(404).json({ message: "No submission found for this opportunity" });
    }
    
    res.status(200).json(submission);
  } catch (error) {
    next(error);
  }
};

// Update submission (before feedback is given)
export const updateSubmission = async (req, res, next) => {
  try {
    const { opportunityId } = req.params;
    const { description, pptUrl, reportUrl, additionalFiles } = req.body;
    const studentId = req.user.id;
    
    const submission = await Submission.findOne({
      studentId,
      opportunityId,
      status: { $in: ['pending', 'submitted'] }
    });
    
    if (!submission) {
      return next(errorHandler(404, "Submission not found or already processed"));
    }
    
    submission.submission = {
      description: description || submission.submission.description,
      pptUrl: pptUrl || submission.submission.pptUrl,
      reportUrl: reportUrl || submission.submission.reportUrl,
      additionalFiles: additionalFiles || submission.submission.additionalFiles
    };
    submission.status = 'submitted';
    
    await submission.save();
    
    res.status(200).json({ 
      message: "Submission updated successfully", 
      submission 
    });
  } catch (error) {
    next(error);
  }
};