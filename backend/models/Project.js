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
      default: 0
    },

    needed: {
      type: Number,
      default: 0
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

  projectType: {
    type: String,
    enum: ["Hackathon", "Startup", "College Project", "Open Source", "Other"],
    default: "Other"
  },

  availability: {
    type: Number,
    default: 0
  },

  openings: {
    type: Number,
    default: 0
  },

  joinRequests: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending"
      },
      skills: [String],
      interests: String,
      availability: Number,
      github: String,
      portfolio: String,
      message: String,
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

projectSchema.index({ status: 1, createdAt: -1 });
projectSchema.index({ creator: 1, createdAt: -1 });

export default mongoose.model("Project", projectSchema);
