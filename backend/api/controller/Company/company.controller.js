import Company from "../../model/company.model.js";
import Opportunity from "../../model/opportunity.model.js";
import { errorHandler } from "../../middlewares/error.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export const handleCompanySignUp = async (req, res, next) => {
  const { username, name, email, password, url } = req.body;

  if (
    !username ||
    !name ||
    !email ||
    !password ||
    username === "" ||
    name === "" ||
    email === "" ||
    password === ""
  ) {
    return next(errorHandler(400, "Username, name, email and password are required"));
  }

  // Check for existing company
  const existingCompany = await Company.findOne({
    $or: [{ email }, { username }],
  });

  if (existingCompany) {
    return res
      .status(400)
      .json({ message: "Email or username already in use" });
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);

  const newCompany = new Company({
    username,
    name,
    email,
    password: hashedPassword,
    url: url || null,
  });

  try {
    const savedCompany = await newCompany.save();

    const { password: hashedPassword, ...rest } = savedCompany._doc;

    // JWT token
    const token = jwt.sign(
      { id: savedCompany._id, isCompany: true },
      process.env.JWT_SECRET
    );
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      maxAge: 30 * 24 * 60 * 60 * 1000
    });

    res.status(201).json({...rest,token});
  } catch (error) {
    next(error);
  }
};

// FIXED: Changed User to Company in signIn function
export const handleCompanySignIn = async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password || username === "" || password === "") {
    return next(errorHandler(400, "Username and password are required"));
  }

  try {
    // Find company by username or email
    const company = await Company.findOne({
      $or: [{ username }, { email: username }]
    });
    
    if (!company) {
      return res.status(400).json({ message: "Invalid username/email or password" });
    }

    const isPasswordValid = await bcryptjs.compare(password, company.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid username/email or password" });
    }

    const token = jwt.sign(
      { 
        id: company._id, 
        isCompany: true,
        isAdmin: false 
      },
      process.env.JWT_SECRET,
      { expiresIn: "3d" }
    );

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      maxAge: 30 * 24 * 60 * 60 * 1000
    });

    const { password: hashedPassword, ...rest } = company._doc;

    res.status(200).json({...rest, token});
  } catch (error) {
    next(error);
  }
};

export const updateCompanyPassword = async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  const companyId = req.user.id;

  try {
    const company = await Company.findById(companyId);
    
    if (!company) {
      return next(errorHandler(404, "Company not found"));
    }
    
    // Verify current password
    const isPasswordValid = await bcryptjs.compare(currentPassword, company.password);
    if (!isPasswordValid) {
      return next(errorHandler(400, "Current password is incorrect"));
    }
    
    const hashedNewPassword = bcryptjs.hashSync(newPassword, 10);
    company.password = hashedNewPassword;
    await company.save();
    
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    next(error);
  }
};

export const updateCompanyProfile = async (req, res, next) => {
  const { name, url, profilePicture } = req.body;
  const companyId = req.user.id;

  try {
    const updatedCompany = await Company.findByIdAndUpdate(
      companyId,
      {
        $set: {
          name: name,
          url: url,
          profilePicture: profilePicture
        }
      },
      { new: true }
    );

    if (!updatedCompany) {
      return next(errorHandler(404, "Company not found"));
    }

    const { password, ...rest } = updatedCompany._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const companyLogout = async (req, res) => {
  res.clearCookie("jwt").status(200).json({ message: "Logout successful" });
};

export const getCompanyProfile = async (req, res, next) => {
  try {
    const company = await Company.findById(req.user.id);
    if (!company) {
      return next(errorHandler(404, "Company not found"));
    }
    
    const { password, ...rest } = company._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const getMyapplicants = async (req,res,next) => {
   
    try {
        const { id }= req.params;
      const opportunity = await Opportunity.findById(id).populate("applicants.userId", "email username");
      console.log("Opp: ", opportunity);
      if(!opportunity) {
        return res.status(404).json("NO OPPORTUNITY FOUND");

      }
      const applicant = opportunity.applicants;
       if (!applicant || applicant.length === 0) {
      return res.status(200).json({ message: "No applicants yet." });
    }
    res.status(200).json(applicant);

    } catch (error) {
      console.error("Error fetching applicants",error);
      next(error);
    }
}

export const updateApplicantStatus = async (req, res, next) => {
  try {
    const { opportunityId, userId } = req.params;
    const { status } = req.body;
    
    // Validate status
    if (!['applied', 'selected', 'rejected'].includes(status)) {
      return next(errorHandler(400, "Invalid status"));
    }
    
    const opportunity = await Opportunity.findById(opportunityId);
    
    if (!opportunity) {
      return next(errorHandler(404, "Opportunity not found"));
    }
    
     
    if (
      opportunity.createdBy.id.toString() !== req.user.id && 
      !req.user.isAdmin
    ) {
      return next(errorHandler(403, "You are not authorized to update applicant status"));
    }
    
    // Find the applicant
    const applicantIndex = opportunity.applicants.findIndex(
      applicant => applicant.userId.toString() === userId
    );
    
    if (applicantIndex === -1) {
      return next(errorHandler(404, "Applicant not found"));
    }
    
 
    opportunity.applicants[applicantIndex].status = status;
    
 
    if (status === 'selected') {
      const alreadySelected = opportunity.selectedCandidates.find(
        candidate => candidate.userId.toString() === userId
      );
      
      if (!alreadySelected) {
        opportunity.selectedCandidates.push({
          userId,
           
           
        });
      }
    }
    
    await opportunity.save();
    
    res.status(200).json({ 
      message: "Applicant status updated successfully",
      opportunity
    });
  } catch (error) {
    next(error);
  }
};