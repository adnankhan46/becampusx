// api/model/opportunity.model.js
import mongoose from "mongoose";

const opportunitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  numberOfOpenings: {
    type: Number,
    required: true,
    min: 1
  },
  isPaid: {
    type: Boolean,
    required: true
  },
  amount: {
    type: Number,
    default: 0,
    required: function() {
      return this.isPaid === true;
    }
  },
  deadline: {
    type: Date,
    required: true
  },
  proofOfWork: {
    screenshot: {
      type: String,
      default: null
    },
    link: {
      type: String,
      default: null
    }
  },
  type: {
    type: String,
    required: true,
    enum: ['engagement', 'survey', 'academic', 'development', 'marketing', 'design', 'research', 'other']
  },
  status: {
    type: String,
    required: true,
    enum: ['open', 'closed', 'filled', 'expired'],
    default: 'open'
  },
  creator: {
    type: String,
    required: true,
    enum: ['Company', 'User']
  },
  createdBy: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'creator'
    },
    name: {
      type: String,
      required: true
    }
  },
  applicants: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['applied', 'shortlisted', 'selected', 'rejected'],
      default: 'applied'
    },
    appliedAt: {
      type: Date,
      default: Date.now
    }
  }],
  paymentStatus: {
      firstPayment: {
        status: {
          type: Boolean,
          default: false
        },
        date: {
          type: Date,
          default: null
        }
      },
      secondPayment: {
        status: {
          type: Boolean,
          default: false
        },
        date: {
          type: Date,
          default: null
        }
      }
    },
  selectedCandidates: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }]
}, { timestamps: true });

// Add index for efficient queries
opportunitySchema.index({ status: 1, deadline: 1 });
opportunitySchema.index({ creator: 1, 'createdBy.id': 1 });
opportunitySchema.index({ type: 1 });

// Virtual for calculating if deadline has passed
opportunitySchema.virtual('isExpired').get(function() {
  return new Date() > this.deadline;
});

// Middleware to auto-update status to 'expired' when retrieving
// opportunitySchema.pre('find', function() {
//   this.where({ 
//     status: 'open', 
//     deadline: { $lt: new Date() } 
//   }).updateMany({ $set: { status: 'expired' } });
// });

const Opportunity = mongoose.model("Opportunity", opportunitySchema);

export default Opportunity;