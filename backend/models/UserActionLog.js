import mongoose from "mongoose";

const userActionLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    userName: {
      type: String,
      required: true
    },
    action: {
      type: String,
      required: true,
      index: true
    },
    description: {
      type: String,
      required: true
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    ipAddress: {
      type: String
    },
    userAgent: {
      type: String
    }
  },
  {
    timestamps: { createdAt: "timestamp", updatedAt: false }
  }
);

// Add indexes for efficient searching
userActionLogSchema.index({ userName: 1 });
userActionLogSchema.index({ action: 1 });
userActionLogSchema.index({ timestamp: -1 });

export default mongoose.model("UserActionLog", userActionLogSchema);
