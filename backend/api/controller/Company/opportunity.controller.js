import mongoose from "mongoose";
import Opportunity from "../../model/opportunity.model.js";
import Company from "../../model/company.model.js";
import User from "../../model/user.model.js";
import { errorHandler } from "../../middlewares/error.js";
// Create a new opportunity
export const createOpportunity = async (req, res, next) => {
  try {
    const { title, description, numberOfOpenings, isPaid, amount, deadline, proofOfWork, type } = req.body;

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

// Get all opportunities (with filters)
// export const getOpportunities = async (req, res, next) => {
//   try {
//     console.log("Starting getOpportunities");
//     const { status, type, isPaid, creator, page = 1, limit = 10, sort = '-createdAt' } = req.query;

//     // Validate and convert pagination parameters
//     const pageNum = parseInt(page) || 1;
//     const limitNum = parseInt(limit) || 10;
//     const skip = (pageNum - 1) * limitNum;

//     console.log(`Pagination: page=${pageNum}, limit=${limitNum}, skip=${skip}`);

//     // Build query object
//     const query = {};
//     if (status) query.status = status;
//     if (type) query.type = type;
//     if (isPaid !== undefined) query.isPaid = isPaid === 'true';
//     if (creator) query.creator = creator;

//     console.log("Query filters:", JSON.stringify(query));

//     // First get total count for pagination info (not affected by pre-find middleware)
//     const totalCount = await Opportunity.countDocuments(query);
//     console.log(`Total count: ${totalCount}`);

//     // Get raw data from MongoDB to check what's in the database
//     const db = mongoose.connection.db;
//     const opportunitiesCollection = db.collection('opportunities');
//     const rawOpportunities = await opportunitiesCollection.find(query).toArray();
//     console.log(`Raw MongoDB documents: ${rawOpportunities.length}`);
    
//     if (rawOpportunities.length > 0) {
//       console.log("First raw opportunity:", JSON.stringify(rawOpportunities[0]._id));
//     }

//     // Try with explicit find that avoids pre-find middleware
//     const opportunities = await Opportunity.find(query)
//       .sort(sort)
//       .skip(skip)
//       .limit(limitNum)
//       .setOptions({ skipMiddleware: true }); // Try to bypass middleware if possible
    
//     console.log(`Retrieved ${opportunities.length} opportunities with middleware bypass attempt`);
    
//     // If still empty, try with a direct aggregation
//     if (opportunities.length === 0) {
//       console.log("Attempting direct aggregation...");
//       const aggregateResults = await Opportunity.aggregate([
//         { $match: query },
//         { $sort: { createdAt: -1 } },
//         { $skip: skip },
//         { $limit: limitNum }
//       ]);
      
//       console.log(`Aggregation returned ${aggregateResults.length} results`);
      
//       if (aggregateResults.length > 0) {
//         console.log("Using aggregation results");
//         // Return the aggregation results
//         res.status(200).json({
//           opportunities: aggregateResults,
//           totalPages: Math.ceil(totalCount / limitNum),
//           currentPage: pageNum,
//           totalCount
//         });
//         return;
//       }
//     }
    
 
//     // If we get here, use whatever the find returned (even if empty)
//     const opportunitiesData = opportunities.map(opp => {
//       return opp.toObject({ virtuals: true });
//     });
    
//     // Send response
//     res.status(200).json({
//       opportunities: opportunitiesData,
//       totalPages: Math.ceil(totalCount / limitNum),
//       currentPage: pageNum,
//       totalCount
//     });
    
//     console.log("Response sent successfully");
//   } catch (error) {
//     console.error("Error in getOpportunities:", error);
//     next(error);
//   }
// };
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
    const { page = 1, limit = 6 } = req.query;

    // Ensure page and limit are numbers
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    // Fetch opp 
    const opportunities = await Opportunity.find()
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    // Total number of the user (for pagination logic)
    const totalOpp = await Opportunity.countDocuments();

    // Check if there are more posts to fetch
    const hasMore = (pageNumber * limitNumber) < totalOpp;

    // Return opp and pagination data
    res.status(200).json({
      opportunities,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalOpp / limitNumber),
      hasMore: hasMore // Pagination check
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(400).json({ message: 'Server error' });
  }
}

export const getOpportunityByCompanyId = async (req, res, next) => {
  try {
    const companyId = req.params.id;
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