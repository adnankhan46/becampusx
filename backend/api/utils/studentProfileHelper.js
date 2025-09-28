// backend/api/utils/studentProfileHelper.js
import StudentProfile from "../model/studentProfile.model.js";
import Opportunity from "../model/opportunity.model.js";

/**
 * Auto-update student profile when opportunity status changes
 * @param {String} userId - Student's user ID
 * @param {String} opportunityId - Opportunity ID
 * @param {String} status - New status (shortlisted, selected, rejected, completed)
 * @param {Object} additionalData - Optional data (startDate, endDate, description, certificate)
 */
export const autoUpdateStudentProfile = async (userId, opportunityId, status, additionalData = {}) => {
  try {
    // Only update profile for meaningful status changes
    const trackableStatuses = ['shortlisted', 'selected', 'rejected', 'completed'];
    if (!trackableStatuses.includes(status)) {
      return { success: true, message: "Status not tracked in profile" };
    }

    // Get opportunity details
    const opportunity = await Opportunity.findById(opportunityId).populate('createdBy.id', 'name');
    if (!opportunity) {
      throw new Error("Opportunity not found");
    }

    // Get company name
    let companyName = "Unknown Company";
    if (opportunity.creator === 'Company' && opportunity.createdBy.id?.name) {
      companyName = opportunity.createdBy.id.name;
    } else if (opportunity.createdBy.name) {
      companyName = opportunity.createdBy.name;
    }

    // Check if this opportunity already exists in student's history
    const existingProfile = await StudentProfile.findOne({
      userId,
      "opportunityHistory.opportunityId": opportunityId
    });

    if (existingProfile) {
      // Update existing entry
      const updateFields = {
        "opportunityHistory.$.status": status,
        "opportunityHistory.$.addedAt": new Date()
      };

      // Add additional fields if provided
      if (additionalData.startDate) updateFields["opportunityHistory.$.startDate"] = additionalData.startDate;
      if (additionalData.endDate) updateFields["opportunityHistory.$.endDate"] = additionalData.endDate;
      if (additionalData.description) updateFields["opportunityHistory.$.description"] = additionalData.description;
      if (additionalData.certificate) updateFields["opportunityHistory.$.certificate"] = additionalData.certificate;

      await StudentProfile.findOneAndUpdate(
        { 
          userId,
          "opportunityHistory.opportunityId": opportunityId
        },
        { $set: updateFields }
      );

    } else {
      // Create new entry in student's opportunity history
      const historyEntry = {
        opportunityId: opportunity._id,
        title: opportunity.title,
        companyName: companyName,
        status: status,
        startDate: additionalData.startDate || (status === 'selected' ? new Date() : null),
        endDate: additionalData.endDate || null,
        description: additionalData.description || `${status.charAt(0).toUpperCase() + status.slice(1)} for ${opportunity.title}`,
        certificate: additionalData.certificate || null
      };

      // Add to student profile (create profile if doesn't exist)
      await StudentProfile.findOneAndUpdate(
        { userId },
        { 
          $push: { opportunityHistory: historyEntry },
          $set: { updatedAt: new Date() }
        },
        { new: true, upsert: true }
      );
    }

    return { success: true, message: "Student profile updated successfully" };

  } catch (error) {
    console.error("Error updating student profile:", error);
    return { success: false, message: error.message };
  }
};

/**
 * Bulk update student profiles for multiple applicants
 * @param {Array} applicants - Array of {userId, opportunityId, status} objects
 */
export const bulkUpdateStudentProfiles = async (applicants) => {
  const results = [];
  
  for (const applicant of applicants) {
    const result = await autoUpdateStudentProfile(
      applicant.userId, 
      applicant.opportunityId, 
      applicant.status,
      applicant.additionalData
    );
    results.push({ ...applicant, ...result });
  }
  
  return results;
};