import mongoose from "mongoose";

const replySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  text: String
}, { timestamps: true });

const academicPostSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  tags: [String],

  replies: [replySchema]

}, { timestamps: true });

export default mongoose.model("AcademicPost", academicPostSchema);