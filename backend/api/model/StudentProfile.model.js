import mongoose from "mongoose";

const studentProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  skills: [{
    name: {
      type: String,
      required: true
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
      default: 'Beginner'
    }
  }],
  resume: {
    fileName: {
      type: String,
      default: null
    },
    fileUrl: {
      type: String,
      default: null
    },
    uploadedAt: {
      type: Date,
      default: null
    }
  },
  opportunityHistory: [{
    opportunityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Opportunity',
      required: true
    },
    title: {
      type: String,
      required: true
    },
    companyName: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['applied', 'shortlisted', 'selected', 'rejected', 'completed'],
      required: true
    },
    startDate: {
      type: Date,
      default: null
    },
    endDate: {
      type: Date,
      default: null
    },
    description: {
      type: String,
      default: null
    },
    certificate: {
      type: String,
      default: null
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  bio: {
    type: String,
    maxlength: 500,
    default: null
  },
  portfolio: {
    type: String,
    default: null
  },
  socialLinks: {
    linkedin: {
      type: String,
      default: null
    },
    github: {
      type: String,
      default: null
    },
    twitter: {
      type: String,
      default: null
    }
  }
}, { timestamps: true });

// Index for efficient queries
studentProfileSchema.index({ userId: 1 });
studentProfileSchema.index({ 'skills.name': 1 });

const StudentProfile =
  mongoose.models.StudentProfile ||
  mongoose.model("StudentProfile", studentProfileSchema);

export default StudentProfile;