import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
{
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  type: {
    type: String,
    enum: [
      "like",
      "comment",
      "follow",
      "joinRequest",
      "joinAccepted",   // ✅ ADD THIS
      "joinRejected",   // ✅ ADD THIS
      "eventRegistration",
      "opportunityUpdate",
      "projectUpdate"
    ],
    required: true
  },

  message: {
    type: String,
    required: true
  },

  relatedId: mongoose.Schema.Types.ObjectId,

  relatedModel: {
    type: String,
    enum: ["Post","Project","Event","Opportunity"]
  },

  read: {
    type: Boolean,
    default: false
  }
},
{
  timestamps: true
}
);

export default mongoose.model("Notification", notificationSchema);