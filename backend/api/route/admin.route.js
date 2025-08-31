/** API:  [PayToApplicants]
 * @Needs make sure 2nd payment done & get array of shortlisted applicant to pay them
 * @Response PaidToApplicant, {"payment-to-applicants": "paid"}
 */

import express from "express";
import { verifyAdmin } from "../middlewares/auth.js";
import { getAllOpportunities, getOpportunityByCompanyId, getOpportunityById } from "../controller/Company/opportunity.controller.js";
import { allApplicants, allComments, allCompany, allUsers } from "../controller/Admin/admin.controller.js";
import { allPost, allPostByUser, getSinglePost } from "../controller/post.controller.js";
import { getMyapplicants } from "../controller/Company/company.controller.js";

const router = express.Router();

// router.use(verifyAdmin);


/**
 * @Title Section 1 : Anonymous Social Dashboard
 * @Routes - allUsers/byId      --- 1.1 [USER]
 *         - allPost/byId       --- 1.2 [POST]
 *         - allComments/byId   ---1.3 [COMMENT]
 */

// --- API 1.1: USER
router.get('/getAllUsers' , allUsers);
// --- API 1.2: USER
router.get('/getAllPosts' , allPost);
router.get('/getAllPostsByUser' , allPostByUser); // pass query as 'userId'
router.get('/getSinglePost/:postId' , getSinglePost);  // pass params as 'postId'
// --- API 1.3: USER
router.get('/getAllComments' , allComments);

/**
 * @Title Section 2 : Opportunities Dashboard
 * @Routes - allOpp/byId/OppByCompanyId   --- 2.1 [OPPORTUNITY]
 *         - allCompany                   --- 2.2 [COMPANY]
 *         - allApplicants/AppByOppId     --- 2.3 [APPLICANT]
 *         - payToApplicants              --- 2.4 [PAYMENT]*
 */

// --- API 2.1: OPP
router.get('/getAllOpp' , getAllOpportunities);
router.get('/getAllOpp/:id' , getOpportunityById);
router.get('/getAllOppByComp/:companyId' , getOpportunityByCompanyId); // pass params as 'companyId'

// --- API 2.2: COMP
router.get('/getAllCompany', allCompany);

// --- API 2.3: Get all applicants by companyId
router.get('/getAllApplicants', allApplicants);
router.get('/getAllApplicantsByCompany/:id', getMyapplicants);

// === API 2.4: PAYMENT


// API 1: Get shortlisted applicants from Opp's whose 2nd payment.status == TRUE
router.get('/getShortlisted', ); // *TODO

// API 2: Pay to shortlisted applicants
router.post('/payToApplicants', ); // *TODO: admin pays to selected applicants, if opp's second payment done

export default router;
