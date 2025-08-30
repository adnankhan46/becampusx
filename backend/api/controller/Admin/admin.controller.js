// AUTH, []
// api 1: 
/**
 * To Login
 */


// VERIFY-PAYMENT, [verifyOpp/:OPPid]
// api 1: 
/**
 * @Needs oppid > companyid + payment proof (SS or payId)[RAZORPAY] + 1st-payment/2nd-Payment
 * @TODO  we change the firstpayment to True from False [MANUALLY]
 * @middleware to decide check if 1st-payment is done or not for 2nd
 */


// OPP, [getAllOpp] , [getAllOpp/COmpany/:companyId]
/** API 1:  [getAllOpp] - with filters
 * @Response get all users who are applicant
 */
/** API 2:  [getAllgetAllOpp/COmpany/:companyIdlOpp]
 * @Response same as API 1 of APPLICANT section of Company route
 */

// PAYMENT, [GetShortlisted], [PayToApplicants]
/** API 1:  [GetShortlisted]
 * @Needs applicant.status==selected + 2ndPayment of an Opp  || This will be in Company to send this data to Admin
 * @Response got
 */
/** API 2:  [PayToApplicants]
 * @Needs make sure 2nd payment done & get array of shortlisted applicant to pay them
 * @Response PaidToApplicant, {"payment-to-applicants": "paid"}
 */

import mongoose from "mongoose";
import User from "../../model/user.model.js";
import Comment from "../../model/comment.model.js";
import Company from "../../model/company.model.js";
import Applicant from "../../model/applicant.model.js";


export const allUsers = async (req, res) => {
try {
    const { page = 1, limit = 6 } = req.query;

    // Ensure page and limit are numbers
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    // Fetch posts only for the specific user
    const users = await User.find()
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    // Total number of the user (for pagination logic)
    const totalUsers = await User.countDocuments();

    // Check if there are more posts to fetch
    const hasMore = (pageNumber * limitNumber) < totalUsers;

    // Return posts and pagination data
    res.status(200).json({
      users,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalUsers / limitNumber),
      hasMore: hasMore // Pagination check
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

export const allComments = async (req, res) => {
try {
    const { page = 1, limit = 6 } = req.query;

    // Ensure page and limit are numbers
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    // Fetch posts only for the specific user
    const comments = await Comment.find()
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    // Total number of the user (for pagination logic)
    const totalComments = await Comment.countDocuments();

    // Check if there are more posts to fetch
    const hasMore = (pageNumber * limitNumber) < totalComments;

    // Return posts and pagination data
    res.status(200).json({
      comments,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalComments / limitNumber),
      hasMore: hasMore // Pagination check
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

export const allCompany = async (req, res) => {
try {
    const { page = 1, limit = 6 } = req.query;

    // Ensure page and limit are numbers
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    // Fetch posts only for the specific user
    const companies = await Company.find()
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    // Total number of the user (for pagination logic)
    const totalComp = await Company.countDocuments();

    // Check if there are more posts to fetch
    const hasMore = (pageNumber * limitNumber) < totalComp;

    // Return posts and pagination data
    res.status(200).json({
      companies,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalComp / limitNumber),
      hasMore: hasMore // Pagination check
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

export const allApplicants = async (req, res) => {
try {
    const { page = 1, limit = 6 } = req.query;

    // Ensure page and limit are numbers
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    // Fetch app only for the specific user
    const applicants = await Applicant.find()
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    // Total number of the app (for pagination logic)
    const totalApplicant = await Applicant.countDocuments();

    // Check if there are more posts to fetch
    const hasMore = (pageNumber * limitNumber) < totalApplicant;

    // Return posts and pagination data
    res.status(200).json({
      applicants,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalApplicant / limitNumber),
      hasMore: hasMore // Pagination check
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Server error' });
  }
}