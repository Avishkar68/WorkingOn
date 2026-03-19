import mongoose from "mongoose";

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
    enum: ["active","reported","hidden"],
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

export default mongoose.model("Post", postSchema);
