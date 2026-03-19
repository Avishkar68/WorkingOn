import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
{
  title: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],

  teamSize: {
    current: {
      type: Number,
      default: 1
    },

    needed: {
      type: Number,
      required: true
    }
  },

  techStack: [
    {
      type: String
    }
  ],

  skillsRequired: [
    {
      type: String
    }
  ],

  image: {
    type: String
  },

  tags: [
    {
      type: String
    }
  ],

  joinRequests: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      message: String,
      status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending"
      },
      contact: String 
    }
  ],

  status: {
    type: String,
    enum: ["active","completed","hidden"],
    default: "active"
  }
},
{
  timestamps: true
}
);

export default mongoose.model("Project", projectSchema);
