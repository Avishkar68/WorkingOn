import User from "../models/User.js";
import Post from "../models/Post.js";
import Comment from "../models/Comment.js";

const normalizeDay = (value) => {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
};

// New Utility for String-based Date Comparison
const toDateString = (date) => {
  // ✅ FORCE IST (Asia/Kolkata) - Returns YYYY-MM-DD
  return new Date(date).toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
};

const isSameDay = (a, b) => {
  if (!a || !b) return false;
  return toDateString(a) === toDateString(b);
};

const getYesterdayString = (date) => {
  const d = new Date(date);
  // Subtract 24 hours to be safe for DST/Timezone shifts, though India has no DST
  d.setHours(d.getHours() - 24); 
  return toDateString(d);
};

const calculateStreakFromHistory = (history, dailyTasksCompleted, userId) => {
  const istNow = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
  console.log(`[StreakCalc v1.3] Starting for user ${userId} at IST: ${istNow}`);
  
  if (!history || history.length === 0) {
    console.log(`[StreakCalc v1.3] No history found.`);
    return 0;
  }

  // 1. Get unique date strings (in IST) and sort descending
  const dateStrings = [...new Set(history.map(d => toDateString(d)))].sort().reverse();
  console.log(`[StreakCalc] History Strings (IST, Sorted Desc):`, dateStrings);
  
  const todayStr = toDateString(new Date());
  const yesterdayStr = getYesterdayString(new Date());
  console.log(`[StreakCalc v1.3] TodayIST: ${todayStr}, YesterdayIST: ${yesterdayStr}`);

  const latestRecorded = dateStrings[0];
  if (latestRecorded !== todayStr && latestRecorded !== yesterdayStr) {
    console.log(`[StreakCalc] Streak broken. Latest activity was ${latestRecorded}`);
    return 0;
  }

  let count = 0;
  let currentRef = latestRecorded;

  for (const dateStr of dateStrings) {
    if (dateStr === currentRef) {
      count++;
      currentRef = getYesterdayString(new Date(currentRef + "T12:00:00")); // Use noon to avoid boundary issues
    } else {
      console.log(`[StreakCalc] Gap found at ${currentRef}. Stopping count.`);
      break;
    }
  }

  console.log(`[StreakCalc] Final Streak Count (IST): ${count}`);
  return count;
};

export const tryUpdateStreakIfReady = async (user) => {
  const today = new Date();
  const todayStr = toDateString(today);

  if (!user) return { updated: false };

  const { quizCompleted, postCreated } = user.dailyTasksCompleted || {};
  const alreadyRecorded = user.streakHistory?.some((day) => toDateString(day) === todayStr);

  console.log(`[StreakUpdate] Quiz: ${quizCompleted}, Post: ${postCreated}, AlreadyRecorded: ${alreadyRecorded}, TodayIST: ${todayStr}`);

  if (!quizCompleted || !postCreated || alreadyRecorded) {
    return { updated: false, alreadyRecorded };
  }

  // Record today in history
  user.streakHistory = user.streakHistory || [];
  user.streakHistory.push(today);

  // Recalculate count
  user.streakCount = calculateStreakFromHistory(user.streakHistory, user.dailyTasksCompleted, user._id);

  await user.save();


  return {
    updated: true,
    streakCount: user.streakCount,
    streakHistory: user.streakHistory
  };
};

export const markQuizCompleted = async (userId) => {
  const today = new Date();
  const todayStr = toDateString(today);
  let user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  const needsReset = !user.lastActiveDate || toDateString(user.lastActiveDate) !== todayStr;

  user = await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        lastActiveDate: today,
        "dailyTasksCompleted.quizCompleted": true,
        ...(needsReset ? { "dailyTasksCompleted.postCreated": false } : {})
      }
    },
    { new: true }
  );

  return tryUpdateStreakIfReady(user);
};

export const markPostCreated = async (userId) => {
  const today = new Date();
  const todayStr = toDateString(today);
  let user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  const needsReset = !user.lastActiveDate || toDateString(user.lastActiveDate) !== todayStr;

  user = await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        lastActiveDate: today,
        "dailyTasksCompleted.postCreated": true,
        ...(needsReset ? { "dailyTasksCompleted.quizCompleted": false } : {})
      }
    },
    { new: true }
  );

  return tryUpdateStreakIfReady(user);
};

export const handleStreakUpdate = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const result = await tryUpdateStreakIfReady(user);

    if (!result.updated) {
      return res.status(400).json({
        message: result.alreadyRecorded
          ? "Streak already recorded for today"
          : "Complete both daily tasks to update your streak"
      });
    }

    res.json({
      message: "Streak updated",
      streakCount: result.streakCount,
      streakHistory: result.streakHistory
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update streak" });
  }
};

export const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await User.aggregate([
      {
        $lookup: {
          from: "posts",
          localField: "_id",
          foreignField: "author",
          as: "posts"
        }
      },
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "author",
          as: "comments"
        }
      },
      {
        $addFields: {
          totalPosts: { $size: "$posts" },
          totalComments: { $size: "$comments" },
          score: {
            $add: [
              { $multiply: ["$streakCount", 10] },
              { $size: "$posts" },
              { $size: "$comments" }
            ]
          }
        }
      },
      {
        $project: {
          name: 1,
          profileImage: 1,
          streakCount: 1,
          streakHistory: 1,
          dailyTasksCompleted: 1,
          totalPosts: 1,
          totalComments: 1,
          score: 1
        }
      },
      {
        $sort: { score: -1, streakCount: -1, totalPosts: -1, totalComments: -1 }
      }
    ]);

    res.json(leaderboard);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load leaderboard" });
  }
};

export const getStreakStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const today = new Date();
    const todayStr = toDateString(today);

    // 1. Reset tasks if new day
    if (!user.lastActiveDate || toDateString(user.lastActiveDate) !== todayStr) {
      user.dailyTasksCompleted = { quizCompleted: false, postCreated: false };
    }

    // 2. RECONCILIATION: Recover missing days from post history (last 5 days)
    let historyUpdated = false;
    for (let i = 1; i <= 5; i++) {
      const checkDate = new Date();
      checkDate.setDate(checkDate.getDate() - i);
      const checkDayStr = toDateString(checkDate);

      const inHistory = user.streakHistory?.some(h => toDateString(h) === checkDayStr);
      if (!inHistory) {
        const dayStart = new Date(checkDate);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(checkDate);
        dayEnd.setHours(23, 59, 59, 999);

        const postCount = await Post.countDocuments({
          author: user._id,
          createdAt: { $gte: dayStart, $lte: dayEnd }
        });

        if (postCount > 0) {
          user.streakHistory.push(dayStart);
          historyUpdated = true;
        }
      }
    }

    // 3. ALWAYS RECALCULATE STREAK COUNT FROM HISTORY
    const newCount = calculateStreakFromHistory(user.streakHistory, user.dailyTasksCompleted, user._id);

    if (newCount !== user.streakCount || historyUpdated) {
      user.streakCount = newCount;
      user.streakHistory.sort((a, b) => new Date(a) - new Date(b));
      await user.save();
    }

    const isTodayComplete = user.dailyTasksCompleted?.quizCompleted && user.dailyTasksCompleted?.postCreated;

    res.json({
      streakCount: user.streakCount,
      streakHistory: user.streakHistory,
      dailyTasksCompleted: user.dailyTasksCompleted,
      lastActiveDate: user.lastActiveDate,
      streakCompletedToday: isTodayComplete
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load streak status" });
  }
};
