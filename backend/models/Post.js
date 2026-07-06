import mongoose from "mongoose";
import Community from "./Community.js";
const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    content: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 5000
    },
    community: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Community",
      default: null   // ✅ allow normal posts
    },
    image: {
      type: String
    },

    tags: [
      {
        type: String
      }
    ],

    isAnonymous: {
      type: Boolean,
      default: false
    },

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],

    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
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
    ]
  },
  {
    timestamps: true
  }
);

postSchema.index({ status: 1, createdAt: -1 });
postSchema.index({ community: 1, status: 1, createdAt: -1 });
postSchema.index({ author: 1, createdAt: -1 });

export default mongoose.model("Post", postSchema);
