// backend/api/model/submission.model.js
import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  opportunityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Opportunity',
    required: true
  },
  supervisorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supervisor',
    required: true
  },
  submission: {
    description: {
      type: String,
      required: true
    },
    pptUrl: {
      type: String,
      default: null
    },
    reportUrl: {
      type: String,
      default: null
    },
    additionalFiles: [{
      fileName: String,
      fileUrl: String,
      uploadedAt: {
        type: Date,
        default: Date.now
      }
    }]
  },
  feedback: {
    rating: {
      type: String,
      enum: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'],
      default: null
    },
    skills: [{
      type: String
    }],
    attendance: {
      type: String,
      enum: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'],
      default: null
    },
    remarks: {
      type: String,
      default: null
    },
    recommendation: {
      type: Boolean,
      default: null
    },
    feedbackGivenAt: {
      type: Date,
      default: null
    }
  },
  status: {
    type: String,
    enum: ['pending', 'submitted', 'feedback_given', 'approved', 'rejected'],
    default: 'pending'
  },
  certificateGenerated: {
    type: Boolean,
    default: false
  },
  certificateUrl: {
    type: String,
    default: null
  }
}, { timestamps: true });

submissionSchema.index({ studentId: 1, opportunityId: 1 }, { unique: true });
submissionSchema.index({ supervisorId: 1, status: 1 });

const Submission = mongoose.model("Submission", submissionSchema);
export default Submission;