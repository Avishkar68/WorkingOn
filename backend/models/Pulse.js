import mongoose from "mongoose";

const pulseSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["confession", "poll"],
      required: true
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    content: {
      type: String,
      required: true,
      maxlength: 1000
    },
    image: {
      type: String,
      default: null
    },
    reactions: {
      funny: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      relatable: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      spicy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
    },
    pollOptions: [
      {
        text: String,
        votes: { type: Number, default: 0 }
      }
    ],
    votedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    status: {
      type: String,
      enum: ["active", "reported", "hidden"],
      default: "active"
    },
    reportedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    upvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    downvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ]
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Pulse", pulseSchema);
