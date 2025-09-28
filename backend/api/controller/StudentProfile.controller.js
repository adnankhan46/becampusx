import StudentProfile from "../model/studentProfile.model.js";
import { errorHandler } from "../middlewares/error.js";

// Get student profile
export const getProfile = async (req, res, next) => {
  try {
    const { userId } = req.params;
    
    const profile = await StudentProfile.findOne({ userId }).populate('userId', 'username email admissionNumber');
    
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    
    res.status(200).json(profile);
  } catch (error) {
    next(error);
  }
};

// Create or update basic profile info
export const updateProfile = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { bio, portfolio, socialLinks } = req.body;
    
    const profile = await StudentProfile.findOneAndUpdate(
      { userId },
      { 
        $set: { 
          bio, 
          portfolio, 
          socialLinks,
          updatedAt: new Date()
        }
      },
      { new: true, upsert: true }
    );
    
    res.status(200).json({ message: "Profile updated successfully", profile });
  } catch (error) {
    next(error);
  }
};

// Add skills
export const addSkills = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { skills } = req.body;
    
    if (!skills || !Array.isArray(skills)) {
      return next(errorHandler(400, "Skills array is required"));
    }
    
    const profile = await StudentProfile.findOneAndUpdate(
      { userId },
      { 
        $addToSet: { skills: { $each: skills } },
        $set: { updatedAt: new Date() }
      },
      { new: true, upsert: true }
    );
    
    res.status(200).json({ message: "Skills added successfully", profile });
  } catch (error) {
    next(error);
  }
};

// Update skills
export const updateSkills = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { skills } = req.body;
    
    if (!skills || !Array.isArray(skills)) {
      return next(errorHandler(400, "Skills array is required"));
    }
    
    const profile = await StudentProfile.findOneAndUpdate(
      { userId },
      { 
        $set: { 
          skills,
          updatedAt: new Date()
        }
      },
      { new: true, upsert: true }
    );
    
    res.status(200).json({ message: "Skills updated successfully", profile });
  } catch (error) {
    next(error);
  }
};

// Remove skill
export const removeSkill = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { skillName } = req.body;
    
    const profile = await StudentProfile.findOneAndUpdate(
      { userId },
      { 
        $pull: { skills: { name: skillName } },
        $set: { updatedAt: new Date() }
      },
      { new: true }
    );
    
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    
    res.status(200).json({ message: "Skill removed successfully", profile });
  } catch (error) {
    next(error);
  }
};

// Upload/Update resume
export const updateResume = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { fileName, fileUrl } = req.body;
    
    if (!fileName || !fileUrl) {
      return next(errorHandler(400, "File name and URL are required"));
    }
    
    const profile = await StudentProfile.findOneAndUpdate(
      { userId },
      { 
        $set: { 
          resume: {
            fileName,
            fileUrl,
            uploadedAt: new Date()
          },
          updatedAt: new Date()
        }
      },
      { new: true, upsert: true }
    );
    
    res.status(200).json({ message: "Resume updated successfully", profile });
  } catch (error) {
    next(error);
  }
};

// Add opportunity history
export const addOpportunityHistory = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { opportunityId, title, companyName, status, startDate, endDate, description, certificate } = req.body;
    
    if (!opportunityId || !title || !companyName || !status) {
      return next(errorHandler(400, "OpportunityId, title, companyName and status are required"));
    }
    
    const historyEntry = {
      opportunityId,
      title,
      companyName,
      status,
      startDate: startDate || null,
      endDate: endDate || null,
      description: description || null,
      certificate: certificate || null
    };
    
    const profile = await StudentProfile.findOneAndUpdate(
      { userId },
      { 
        $push: { opportunityHistory: historyEntry },
        $set: { updatedAt: new Date() }
      },
      { new: true, upsert: true }
    );
    
    res.status(200).json({ message: "Opportunity history added successfully", profile });
  } catch (error) {
    next(error);
  }
};

// Update opportunity history
export const updateOpportunityHistory = async (req, res, next) => {
  try {
    const { userId, historyId } = req.params;
    const { status, startDate, endDate, description, certificate } = req.body;
    
    const profile = await StudentProfile.findOneAndUpdate(
      { 
        userId,
        "opportunityHistory._id": historyId
      },
      { 
        $set: { 
          "opportunityHistory.$.status": status || undefined,
          "opportunityHistory.$.startDate": startDate || undefined,
          "opportunityHistory.$.endDate": endDate || undefined,
          "opportunityHistory.$.description": description || undefined,
          "opportunityHistory.$.certificate": certificate || undefined,
          updatedAt: new Date()
        }
      },
      { new: true }
    );
    
    if (!profile) {
      return res.status(404).json({ message: "Profile or history entry not found" });
    }
    
    res.status(200).json({ message: "Opportunity history updated successfully", profile });
  } catch (error) {
    next(error);
  }
};

// Remove opportunity history
export const removeOpportunityHistory = async (req, res, next) => {
  try {
    const { userId, historyId } = req.params;
    
    const profile = await StudentProfile.findOneAndUpdate(
      { userId },
      { 
        $pull: { opportunityHistory: { _id: historyId } },
        $set: { updatedAt: new Date() }
      },
      { new: true }
    );
    
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    
    res.status(200).json({ message: "Opportunity history removed successfully", profile });
  } catch (error) {
    next(error);
  }
};

// Get all profiles (for admin)
export const getAllProfiles = async (req, res, next) => {
  try {
    const profiles = await StudentProfile.find().populate('userId', 'username email admissionNumber');
    
    res.status(200).json({ profiles, count: profiles.length });
  } catch (error) {
    next(error);
  }
};