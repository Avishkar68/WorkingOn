import mongoose from "mongoose";

const communitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },

  description: String,

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],

  coverImage: String,

}, { timestamps: true });

communitySchema.index({ createdAt: -1 });
communitySchema.index({ members: 1 });

export default mongoose.model("Community", communitySchema);