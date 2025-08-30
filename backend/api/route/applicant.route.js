import express from "express";
import {
   applicationId,
  applyForOpportunity,
  getMyAppliedOpp
} from "../controller/User/applicant.controller.js";
import { verifyToken } from "../middlewares/auth.js";
import { getOpportunityById } from "../controller/Company/opportunity.controller.js";

const router = express.Router();

/**
 *  User/Applicant Routes: Ordered by AUTH, OPP, Pay1st, Applicants, Pay2nd
 */
//BASE URL = /api/applicants

router.use(verifyToken); // check Logged in

// AUTH
/*
router.get('/verify-email', );
*/

// OPPORTUNITIES
   //API-1 Get all Opp whose 1st payment is verified // TODO
   router.get("/:id", getOpportunityById); // when click on an Opportunity, For User/Admin/Company : [COMMON]

// APPLICANT
router.post("/opportunities/:id/apply", applyForOpportunity); // apply for an opp
   // for profile
    router.get("/applied-opp/:userId", getMyAppliedOpp);  // get only applied opp by user, TODO: params lagana h
   // API-3: TODO:
    router.get("/applied-op/:applicationId",applicationId );  // get SINGLE applied opp detail by application id

// PAY-TO-USER
 // 1API: TODO: TO MAKE THE PAYMENT TO APPLICANT

 export default router;

/**
 *********** Will rollback when decided if user can create an Opportunity  ****************************************************************

router.get("/my-opportunities", verifyCompanyOrAdmin, getMyOpportunities); // for user/applicant Profile
router.put("/opportunities/:opportunityId/applicants/:userId", verifyCompanyOrAdmin, updateApplicantStatus);
router.put("/opportunities/:opportunityId/payments/:userId", verifyCompanyOrAdmin, updatePaymentStatus);
 */
