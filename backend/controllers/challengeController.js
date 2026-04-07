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
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const result = await markQuizCompleted(user._id);

    res.json({
      message: "Quiz marked complete",
      streakUpdated: result.updated,
      streakCount: result.streakCount,
      streakHistory: result.streakHistory
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to complete challenge" });
  }
};
