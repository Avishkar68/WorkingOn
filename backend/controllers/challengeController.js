import DailyChallenge from "../models/DailyChallenge.js";
import User from "../models/User.js";
import { markQuizCompleted, tryUpdateStreakIfReady } from "./streakController.js";

const normalizeDay = (value) => {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
};

const getDefaultChallenge = () => ({
  title: "Daily Streak Challenge",
  description: "Answer a short campus quiz and create a post to keep your streak alive.",
  questions: [
    {
      id: 1,
      type: "multiple-choice",
      question: "Which habit helps you study better?",
      options: [
        "Morning review",
        "Last-minute cramming",
        "Studying with phones nearby",
        "Ignoring breaks"
      ]
    }
  ]
});

export const getTodayChallenge = async (req, res) => {
  try {
    const today = normalizeDay(new Date());

    let challenge = await DailyChallenge.findOne({ date: today });

    if (!challenge) {
      const defaultData = getDefaultChallenge();
      challenge = await DailyChallenge.create({
        ...defaultData,
        date: today,
        active: true
      });
    }

    res.json(challenge);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load today's challenge" });
  }
};

export const completeChallenge = async (req, res) => {
  try {
    const { answer } = req.body;
    const today = normalizeDay(new Date());

    const challenge = await DailyChallenge.findOne({ date: today });

    if (!challenge) {
      return res.status(404).json({ message: "No challenge found for today" });
    }

    // Basic validation: check if given answer matches any question's answer field
    const isCorrect = challenge.questions.some(q => q.answer && q.answer.toString().toLowerCase() === answer?.toString().toLowerCase());

    if (!isCorrect) {
      return res.status(400).json({ message: "Incorrect answer. Try again!" });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const result = await markQuizCompleted(user._id);

    // 🏆 Calculate Rank
    const leaderboard = await User.aggregate([
      { $lookup: { from: "posts", localField: "_id", foreignField: "author", as: "posts" } },
      { $lookup: { from: "comments", localField: "_id", foreignField: "author", as: "comments" } },
      {
        $addFields: {
          score: {
            $add: [
              { $multiply: ["$streakCount", 10] },
              { $size: "$posts" },
              { $size: "$comments" }
            ]
          }
        }
      },
      { $sort: { score: -1, streakCount: -1 } },
      { $group: { _id: null, users: { $push: "$_id" } } }
    ]);

    const rank = leaderboard[0]?.users.findIndex(id => id.toString() === user._id.toString()) + 1 || 0;

    res.json({
      message: "Correct! Quiz marked complete",
      streakUpdated: result.updated,
      streakCount: result.streakCount,
      streakHistory: result.streakHistory,
      rank
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to complete challenge" });
  }
};
