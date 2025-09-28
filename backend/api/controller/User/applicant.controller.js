import Applicant from "../../model/applicant.model.js";
import Opportunity from "../../model/opportunity.model.js";
import StudentProfile from "../../model/studentProfile.model.js";
import { errorHandler } from "../../middlewares/error.js";
import { autoUpdateStudentProfile } from "../../utils/studentProfileHelper.js";

// Apply for opportunity - AUTO UPDATES STUDENT PROFILE
export const applyForOpportunity = async (req, res, next) => {
  try {
    const { id: opportunityId } = req.params;
    const userId = req.user.id;
    const { coverLetter, proofOfWork } = req.body;

    if (!coverLetter) {
      return next(errorHandler(400, "Cover letter is required"));
    }

    // Check if opportunity exists and is open
    const opportunity = await Opportunity.findById(opportunityId);
    if (!opportunity) {
      return next(errorHandler(404, "Opportunity not found"));
    }

    if (opportunity.status !== 'open') {
      return next(errorHandler(400, "Opportunity is not open for applications"));
    }

    // Check if already applied
    const existingApplication = await Applicant.findOne({
      userId,
      opportunityId
    });

    if (existingApplication) {
      return next(errorHandler(400, "Already applied for this opportunity"));
    }

    // Create application
    const application = new Applicant({
      userId,
      opportunityId,
      coverLetter,
      proofOfWork: proofOfWork || { screenshot: null, link: null },
      status: 'applied'
    });

    await application.save();

    // Add to opportunity's applicants array
    await Opportunity.findByIdAndUpdate(
      opportunityId,
      {
        $push: {
          applicants: {
            userId,
            status: 'applied',
            appliedAt: new Date()
          }
        }
      }
    );

    // **AUTO UPDATE STUDENT PROFILE** - Add application to history
    await autoUpdateStudentProfile(userId, opportunityId, 'applied');

    res.status(201).json({
      message: "Application submitted successfully and added to profile",
      application
    });

  } catch (error) {
    next(error);
  }
};

// Update payment status
export const updatePaymentStatus = async (req, res, next) => {
  try {
    const { opportunityId, userId } = req.params;
    const { paymentType, status } = req.body;
    
    // Validate payment type
    if (!['firstPayment', 'secondPayment'].includes(paymentType)) {
      return next(errorHandler(400, "Invalid payment type"));
    }
    
    const opportunity = await Opportunity.findById(opportunityId);
    
    if (!opportunity) {
      return next(errorHandler(404, "Opportunity not found"));
    }
    
    // Check if the user is authorized
    if (
      opportunity.createdBy.id.toString() !== req.user.id && 
      !req.user.isAdmin
    ) {
      return next(errorHandler(403, "You are not authorized to update payment status"));
    }
    
    // Find the selected candidate
    const candidateIndex = opportunity.selectedCandidates.findIndex(
      candidate => candidate.userId.toString() === userId
    );
    
    if (candidateIndex === -1) {
      return next(errorHandler(404, "Selected candidate not found"));
    }
    
    // Update payment status
    opportunity.selectedCandidates[candidateIndex].paymentStatus[paymentType].status = status;
    opportunity.selectedCandidates[candidateIndex].paymentStatus[paymentType].date = status ? new Date() : null;
    
    await opportunity.save();
    
    res.status(200).json({ 
      message: "Payment status updated successfully",
      opportunity
    });
  } catch (error) {
    next(error);
  }
};

// Get opportunities a user has applied for
export const getMyAppliedOpp = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Get applications from Applicant model
    const applications = await Applicant.find({ userId })
      .populate('opportunityId', 'title description amount deadline status creator createdBy')
      .sort({ appliedAt: -1 });

    // Also get from student profile for consistency
    const studentProfile = await StudentProfile.findOne({ userId });

    res.status(200).json({
      applications,
      profileHistory: studentProfile?.opportunityHistory || [],
      count: applications.length
    });

  } catch (error) {
    next(error);
  }
};

// Get opportunities created by current company/user
export const getMyOpportunities = async (req, res, next) => {
  try {
    const { 
      status, 
      type,
      page = 1, 
      limit = 10,
      sort = '-createdAt' 
    } = req.query;
    
    const query = {
      'createdBy.id': req.user.id
    };
    
    // Apply filters if provided
    if (status) query.status = status;
    if (type) query.type = type;
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Execute query with pagination and sorting
    const opportunities = await Opportunity.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get total count for pagination
    const totalCount = await Opportunity.countDocuments(query);
    
    res.status(200).json({
      opportunities,
      totalPages: Math.ceil(totalCount / parseInt(limit)),
      currentPage: parseInt(page),
      totalCount
    });
  } catch (error) {
    next(error);
  }
};

export const applicationId = async (req, res, next) => {
  try {
    const { applicationId } = req.params;

    const application = await Applicant.findById(applicationId)
      .populate('userId', 'username email admissionNumber')
      .populate('opportunityId', 'title description amount deadline status creator createdBy');

    if (!application) {
      return next(errorHandler(404, "Application not found"));
    }

    res.status(200).json(application);

  } catch (error) {
    next(error);
  }
};

export const updateApplicationStatus = async (req, res, next) => {
  try {
    const { applicationId } = req.params;
    const { status, additionalData } = req.body;

    const application = await Applicant.findByIdAndUpdate(
      applicationId,
      { status, updatedAt: new Date() },
      { new: true }
    );

    if (!application) {
      return next(errorHandler(404, "Application not found"));
    }

    // **AUTO UPDATE STUDENT PROFILE**
    await autoUpdateStudentProfile(
      application.userId, 
      application.opportunityId, 
      status, 
      additionalData
    );

    res.status(200).json({
      message: "Application status updated and profile synced",
      application
    });

  } catch (error) {
    next(error);
  }
};