import express from "express";
import { 
  handleCompanySignUp, 
  handleCompanySignIn, 
  updateCompanyPassword, 
  updateCompanyProfile,
  companyLogout,
  getCompanyProfile,
  getMyapplicants,
  updateApplicantStatus
} from "../controller/Company/company.controller.js";
 
import {
  createOpportunity,
  getOpportunityById,
  updateOpportunity,
  deleteOpportunity,
  closeOpportunity,
  getOpportunityByCompanyId,
  
} from "../controller/Company/opportunity.controller.js";

import { verifyToken, verifyCompanyOrAdmin } from "../middlewares/auth.js";
import {  MakePayment} from "../controller/Company/payment.controller.js";

const router = express.Router();

/**
 *  Company/Provider Routes: Ordered by AUTH, OPP, Payment, Applicants
   @BASE_URL = /api/company
 */
// AUTH
router.post("/signup", handleCompanySignUp);
router.post("/signin", handleCompanySignIn);
router.post("/logout", companyLogout);

// AUTH - middleware
router.use(verifyToken);

// AUTH - profile
router.get("/profile", getCompanyProfile);
router.put("/update-password", updateCompanyPassword);
router.put("/update-profile", updateCompanyProfile);


// OPPORTUNITY: for Company/Provider
router.post("/create", verifyCompanyOrAdmin, createOpportunity); // for comp
router.get("/myopportunities/:id", verifyCompanyOrAdmin, getOpportunityByCompanyId); // for showing in Company's Profile
///
router.get("/:id", getOpportunityById); // when click on an Opportunity, For User/Admin/Company : [COMMON]
///
router.put("/:id", verifyCompanyOrAdmin, updateOpportunity); // update single opp
router.put("/:id/close", verifyCompanyOrAdmin, closeOpportunity); // can close before deadline
router.delete("/:id", verifyCompanyOrAdmin, deleteOpportunity);

// [#] PAYMENT: 1st & 2nd Handle for Company/Provider to Admin || Logic is handled by Webhook acc to paymentLevel
   router.get('/payments/opportunity/:oppId', MakePayment)

// APPLICANT:
   //API:1 TODO: to get the applicants of a particular opportunity
   router.get("/applicants/:id",verifyCompanyOrAdmin,getMyapplicants);
   //API:2  TODO: to update the status of applicants from applied to selected or shortlisted
   router.put("/applicants/status/:opportunityId/:userId",verifyCompanyOrAdmin,updateApplicantStatus);


export default router;