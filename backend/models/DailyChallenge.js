import mongoose from "mongoose";

const dailyChallengeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    date: {
      type: Date,
      required: true,
      unique: true
    },
    questions: {
      type: mongoose.Schema.Types.Mixed,
      default: []
    },
    active: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("DailyChallenge", dailyChallengeSchema);
