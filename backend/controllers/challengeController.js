import DailyChallenge from "../models/DailyChallenge.js";
import User from "../models/User.js";
import { markQuizCompleted, tryUpdateStreakIfReady } from "./streakController.js";

const getDefaultChallenge = () => ({
  title: "Daily streak quiz",
  description: "Complete today's challenge to stay on track.",
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
      ],
      answer: "Morning review"
    }
  ]
});

const getIstStartOfDay = (date = new Date()) => {
  const istDateStr = new Date(date).toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
  const [year, month, day] = istDateStr.split("-").map(Number);
  
  // ✅ 18:30 UTC of previous day = 00:00 IST of today
  const d = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
  d.setMinutes(d.getMinutes() - 330); 
  return d;
};

export const getTodayChallenge = async (req, res) => {
  try {
    const start = getIstStartOfDay();
    const end = new Date(start);
    end.setHours(end.getHours() + 24);

    console.log(`[Challenge] Searching in Range: ${start.toISOString()} to ${end.toISOString()}`);

    let challenge = await DailyChallenge.findOne({ 
      date: { $gte: start, $lt: end } 
    });

    if (!challenge) {
      console.log(`[Challenge] No challenge found in IST range. Creating default.`);
      const defaultData = getDefaultChallenge();
      challenge = await DailyChallenge.create({
        ...defaultData,
        date: start, // ✅ Store at the IST Midnight anchor (18:30 UTC)
        active: true
      });
    }

    res.json(challenge);
  } catch (err) {
    console.error("[Challenge Error]", err);
    res.status(500).json({ message: "Failed to load today's challenge" });
  }
};

export const completeChallenge = async (req, res) => {
  try {
    const { answer } = req.body;
    const start = getIstStartOfDay();
    const end = new Date(start);
    end.setHours(end.getHours() + 24);

    const challenge = await DailyChallenge.findOne({ 
      date: { $gte: start, $lt: end } 
    });

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

    // 🏆 Calculate Rank (adding try/catch here to prevent 500 if aggregation fails)
    let rank = 0;
    try {
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
      
          rank = leaderboard[0]?.users.findIndex(id => id.toString() === user._id.toString()) + 1 || 0;
    } catch (rankErr) {
        console.error("Rank calculation failed:", rankErr);
    }

    res.json({
      message: "Correct! Quiz marked complete",
      streakUpdated: result.updated,
      streakCount: result.streakCount,
      streakHistory: result.streakHistory,
      rank
    });
  } catch (err) {
    console.error("[CompleteChallenge Error]", err);
    res.status(500).json({ message: "Failed to complete challenge" });
  }
};
