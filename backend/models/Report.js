import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  reportedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  entityModel: {
    type: String,
    required: true,
    enum: ["Post", "Pulse", "Opportunity", "Project", "Event", "User", "Comment"]
  },
  reason: {
    type: String,
    required: true
  },
  snapshot: {
    type: String,
    required: true,
    description: "A stringified backup of the reported content incase it is deleted or edited."
  },
  status: {
    type: String,
    enum: ["pending", "resolved", "dismissed"],
    default: "pending"
  }
}, { timestamps: true });

export default mongoose.model("Report", reportSchema);
