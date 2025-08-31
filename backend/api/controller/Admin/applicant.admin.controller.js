import mongoose from "mongoose";
import Opportunity from "../../model/opportunity.model.js";


export const getShortlisted = async (req, res, next) => {
  try {
    const opportunityId = req.params.opportunityId;
    console.log(opportunityId)
    
    // Find the opportunity and populate selected candidates with user details
    const opportunity = await Opportunity.findById(opportunityId)
      .populate({
        path: 'selectedCandidates.userId',
        select: 'name email username' // Select the fields you want to return
      });
    
    if (!opportunity) {
      return next(errorHandler(404, "Opportunity not found"));
    }
    
    // Extract selected candidates
    const shortlistedCandidates = opportunity.selectedCandidates;
    
    res.status(200).json({
      message: "Shortlisted candidates retrieved successfully",
      PaymentStatus: opportunity.paymentStatus,
      opportunity: opportunity,
      shortlistedCandidates
    });
    
  } catch (error) {
    next(error);
  }
};
