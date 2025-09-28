// backend/api/model/supervisor.model.js
import mongoose from "mongoose";

const supervisorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  department: {
    type: String,
    default: null
  },
  expertise: [{
    type: String
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  assignedStudents: [{
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    opportunityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Opportunity'
    },
    assignedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['assigned', 'submitted', 'feedback_given', 'completed'],
      default: 'assigned'
    }
  }]
}, { timestamps: true });

// Index for efficient queries
supervisorSchema.index({ userId: 1 });
supervisorSchema.index({ 'assignedStudents.studentId': 1 });

const Supervisor = mongoose.model("Supervisor", supervisorSchema);
export default Supervisor;