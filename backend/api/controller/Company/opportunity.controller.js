import mongoose from "mongoose";
import Opportunity from "../../model/opportunity.model.js";
import Company from "../../model/company.model.js";
import User from "../../model/user.model.js";
import { errorHandler } from "../../middlewares/error.js";

// Create a new opportunity
export const createOpportunity = async (req, res, next) => {
  try {
    const { 
      title, 
      description, 
      numberOfOpenings, 
      isPaid, 
      amount, 
      deadline, 
      proofOfWork, 
      type, 
      skills // NEW: Skills array
    } = req.body;

    // Validate required fields
    if (!title || !description || !numberOfOpenings || isPaid === undefined || !deadline || !type) {
      return next(errorHandler(400, "Please provide all required fields"));
    }

    // Validate amount if isPaid is true
    if (isPaid && (!amount || amount <= 0)) {
      return next(errorHandler(400, "Please provide a valid amount for paid opportunity"));
    }

    // Validate deadline is in the future
    const deadlineDate = new Date(deadline);
    if (deadlineDate <= new Date()) {
      return next(errorHandler(400, "Deadline must be in the future"));
    }

    // Validate skills format if provided
    if (skills && Array.isArray(skills)) {
      const validLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
      for (const skill of skills) {
        if (!skill.name || typeof skill.name !== 'string') {
          return next(errorHandler(400, "Each skill must have a valid name"));
        }
        if (skill.level && !validLevels.includes(skill.level)) {
          return next(errorHandler(400, `Invalid skill level. Must be one of: ${validLevels.join(', ')}`));
        }
      }
    }

    let creatorModel;
    let creatorName;

    // Determine if creator is company or user
    if (req.user.isCompany) {
      creatorModel = await Company.findById(req.user.id);
      if (!creatorModel) {
        return next(errorHandler(404, "Company not found"));
      }
      creatorName = creatorModel.name;
    } else if (req.user.isAdmin) {
      creatorModel = await User.findById(req.user.id);
      if (!creatorModel) {
        return next(errorHandler(404, "User not found"));
      }
      creatorName = creatorModel.username;
    } else {
      return next(errorHandler(403, "Only companies or admins can create opportunities"));
    }

    const newOpportunity = new Opportunity({
      title,
      description,
      numberOfOpenings,
      isPaid,
      amount: isPaid ? amount : 0,
      deadline: deadlineDate,
      skills: skills || [], // NEW: Include skills
      proofOfWork: proofOfWork || { screenshot: null, link: null },
      type,
      status: 'open',
      creator: req.user.isCompany ? 'Company' : 'User',
      createdBy: {
        id: req.user.id,
        name: creatorName
      }
    });

    const savedOpportunity = await newOpportunity.save();
    res.status(201).json(savedOpportunity);
  } catch (error) {
    next(error);
  }
};

// Get opportunity by ID
export const getOpportunityById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const opportunity = await Opportunity.findById(id);
    
    if (!opportunity) {
      return next(errorHandler(404, "Opportunity not found"));
    }
    
    res.status(200).json(opportunity);
  } catch (error) {
    next(error);
  }
};

export const getAllOpportunities = async (req,res,next) => {
  try {
    const { page = 1, limit = 6, skills: skillsFilter } = req.query;

    // Ensure page and limit are numbers
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    // Build query for skills filtering
    let query = {};
    if (skillsFilter) {
      const skillsArray = Array.isArray(skillsFilter) ? skillsFilter : [skillsFilter];
      query['skills.name'] = { $in: skillsArray };
    }

    // Fetch opportunities with optional skills filtering
    const opportunities = await Opportunity.find(query)
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    // Total number of opportunities (for pagination logic)
    const totalOpp = await Opportunity.countDocuments(query);

    // Check if there are more posts to fetch
    const hasMore = (pageNumber * limitNumber) < totalOpp;

    // Return opportunities and pagination data
    res.status(200).json({
      opportunities,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalOpp / limitNumber),
      hasMore: hasMore // Pagination check
    });
  } catch (error) {
    console.error('Error fetching opportunities:', error);
    res.status(400).json({ message: 'Server error' });
  }
}

export const getOpportunityByCompanyId = async (req, res, next) => {
  try {
    const companyId = req.params.id;
    console.log("com id", req.params)
    const { page = 1, limit = 10, sort = '-createdAt' } = req.query;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(companyId)) {
      return res.status(400).json({ message: "Invalid company ID format" });
    }

    // Ensure page and limit are numbers
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    // Build query to filter opportunities by company
    const query = {
      creator: "Company",
      "createdBy.id": new mongoose.Types.ObjectId(companyId)
    };

    // Fetch opportunities for the specific company
    const opportunities = await Opportunity.find(query)
    .populate({
        path: 'applicants.userId',
        select: 'name email profile' // returning applicants data, if any
      })
    .populate({
    path: 'selectedCandidates.userId', // returning selected candidates data, if any
    select: 'name email profile'
      })
    .sort(sort)
    .skip((pageNumber - 1) * limitNumber)
    .limit(limitNumber);

    // Total number of opportunities for this company (for pagination logic)
    const totalOpportunities = await Opportunity.countDocuments(query);

    // Check if there are more opportunities to fetch
    const hasMore = (pageNumber * limitNumber) < totalOpportunities;

    // Convert opportunities to plain objects with virtuals
    const opportunitiesData = opportunities.map(opp =>
      opp.toObject({ virtuals: true })
    );

    // Return opportunities and pagination data
    res.status(200).json({
      opportunities: opportunitiesData,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalOpportunities / limitNumber),
      hasMore: hasMore,
      totalCount: totalOpportunities
    });

  } catch (error) {
    console.error("Error in getOpportunityByCompanyId:", error);
    next(error);
  }
};

// Update opportunity
export const updateOpportunity = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Find opportunity
    const opportunity = await Opportunity.findById(id);
    
    if (!opportunity) {
      return next(errorHandler(404, "Opportunity not found"));
    }
    
    // Check if the user is authorized to update this opportunity
    if (
      opportunity.createdBy.id.toString() !== req.user.id && 
      !req.user.isAdmin
    ) {
      return next(errorHandler(403, "You are not authorized to update this opportunity"));
    }
    
    // Validate deadline if provided
    if (updates.deadline) {
      const deadlineDate = new Date(updates.deadline);
      if (deadlineDate <= new Date()) {
        return next(errorHandler(400, "Deadline must be in the future"));
      }
      updates.deadline = deadlineDate;
    }
    
    // Validate amount if isPaid is updated to true
    if (updates.isPaid === true && (!updates.amount || updates.amount <= 0)) {
      return next(errorHandler(400, "Please provide a valid amount for paid opportunity"));
    }

    // Validate skills format if provided
    if (updates.skills && Array.isArray(updates.skills)) {
      const validLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
      for (const skill of updates.skills) {
        if (!skill.name || typeof skill.name !== 'string') {
          return next(errorHandler(400, "Each skill must have a valid name"));
        }
        if (skill.level && !validLevels.includes(skill.level)) {
          return next(errorHandler(400, `Invalid skill level. Must be one of: ${validLevels.join(', ')}`));
        }
      }
    }
    
    const updatedOpportunity = await Opportunity.findByIdAndUpdate(
      id, 
      { $set: updates },
      { new: true, runValidators: true }
    );
    
    res.status(200).json(updatedOpportunity);
  } catch (error) {
    next(error);
  }
};

// Delete opportunity
export const deleteOpportunity = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const opportunity = await Opportunity.findById(id);
    
    if (!opportunity) {
      return next(errorHandler(404, "Opportunity not found"));
    }
    
    // Check if the user is authorized to delete this opportunity
    if (
      opportunity.createdBy.id.toString() !== req.user.id && 
      !req.user.isAdmin
    ) {
      return next(errorHandler(403, "You are not authorized to delete this opportunity"));
    }
    
    await Opportunity.findByIdAndDelete(id);
    
    res.status(200).json({ message: "Opportunity deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// Close opportunity
export const closeOpportunity = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const opportunity = await Opportunity.findById(id);
    
    if (!opportunity) {
      return next(errorHandler(404, "Opportunity not found"));
    }
    
    // Check if the user is authorized to close this opportunity
    if (
      opportunity.createdBy.id.toString() !== req.user.id && 
      !req.user.isAdmin
    ) {
      return next(errorHandler(403, "You are not authorized to close this opportunity"));
    }
    
    opportunity.status = 'closed';
    await opportunity.save();
    
    res.status(200).json({ message: "Opportunity closed successfully", opportunity });
  } catch (error) {
    next(error);
  }
};