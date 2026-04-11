import User from "../models/User.js";
import Post from "../models/Post.js";
import Comment from "../models/Comment.js";

const normalizeDay = (value) => {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
};

const isSameDay = (a, b) => {
  if (!a || !b) return false;
  return normalizeDay(a).getTime() === normalizeDay(b).getTime();
};

const isYesterday = (value, reference) => {
  const day = normalizeDay(value);
  const ref = normalizeDay(reference);
  const diff = (ref.getTime() - day.getTime()) / 86400000;
  return diff === 1;
};

const resetDailyTasksIfNewDay = (user) => {
  const today = normalizeDay(new Date());

  if (!user.lastActiveDate || !isSameDay(user.lastActiveDate, today)) {
    user.dailyTasksCompleted = {
      quizCompleted: false,
      postCreated: false
    };
  }
};

export const tryUpdateStreakIfReady = async (user) => {
  const today = normalizeDay(new Date());

  if (!user) return { updated: false };

  const { quizCompleted, postCreated } = user.dailyTasksCompleted || {};
  const alreadyRecorded = user.streakHistory?.some((day) => isSameDay(day, today));

  if (!quizCompleted || !postCreated || alreadyRecorded) {
    return { updated: false, alreadyRecorded };
  }

  const lastStreakDate = user.streakHistory?.length > 0
    ? normalizeDay(user.streakHistory[user.streakHistory.length - 1])
    : null;

  const nextStreak = lastStreakDate && isYesterday(lastStreakDate, today) ? user.streakCount + 1 : 1;

  user.streakCount = nextStreak;
  user.streakHistory = user.streakHistory || [];

  if (!alreadyRecorded) {
    user.streakHistory.push(today);
  }

  await user.save();

  return {
    updated: true,
    streakCount: user.streakCount,
    streakHistory: user.streakHistory
  };
};

export const markQuizCompleted = async (userId) => {
  const today = normalizeDay(new Date());
  let user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  const needsReset = !user.lastActiveDate || !isSameDay(user.lastActiveDate, today);

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
  const today = normalizeDay(new Date());
  let user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  const needsReset = !user.lastActiveDate || !isSameDay(user.lastActiveDate, today);

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
    const user = await User.findById(req.user._id).select(
      "streakCount streakHistory dailyTasksCompleted lastActiveDate"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const originalTasks = JSON.stringify(user.dailyTasksCompleted);
    const originalStreak = user.streakCount;
    
    resetDailyTasksIfNewDay(user);
    
    // 🔥 RESET STREAK IF BROKEN
    const today = normalizeDay(new Date());
    const lastStreakDate = user.streakHistory?.length > 0
      ? normalizeDay(user.streakHistory[user.streakHistory.length - 1])
      : null;
    
    // If not active today AND not active yesterday, streak is broken
    if (lastStreakDate && !isSameDay(lastStreakDate, today) && !isYesterday(lastStreakDate, today)) {
      user.streakCount = 0;
    }

    if (JSON.stringify(user.dailyTasksCompleted) !== originalTasks || user.streakCount !== originalStreak) {
      await user.save();
    }

    // 🔄 RECONCILIATION: Check if we missed any days (e.g. April 10th) due to race condition
    const lastThreeDays = [];
    for (let i = 1; i <= 3; i++) {
        const d = normalizeDay(new Date());
        d.setDate(d.getDate() - i);
        lastThreeDays.push(d);
    }

    let historyUpdated = false;
    for (const day of lastThreeDays) {
        const inHistory = user.streakHistory?.some(h => isSameDay(h, day));
        if (!inHistory) {
            // Check if user had a post on this day
            const dayStart = new Date(day);
            const dayEnd = new Date(day);
            dayEnd.setHours(23, 59, 59, 999);
            
            const postCount = await Post.countDocuments({
                author: user._id,
                createdAt: { $gte: dayStart, $lte: dayEnd }
            });

            if (postCount > 0) {
                // Recover this day!
                user.streakHistory.push(day);
                user.streakHistory.sort((a, b) => new Date(a) - new Date(b));
                historyUpdated = true;
            }
        }
    }

    if (historyUpdated) {
        // Recalculate streak count based on continuous history
        const sortedHistory = [...user.streakHistory].sort((a, b) => new Date(a) - new Date(b));
        let count = 0;
        let currentRef = normalizeDay(new Date());
        
        // If today is completed, start from today
        const todayDone = user.dailyTasksCompleted?.quizCompleted && user.dailyTasksCompleted?.postCreated;
        if (todayDone) {
            count = 1;
        } else {
            // If today not done, check if yesterday was done
            currentRef = new Date(currentRef);
            currentRef.setDate(currentRef.getDate() - 1);
        }

        // Walk backwards through history
        let checkDate = todayDone ? new Date(normalizeDay(new Date())) : new Date(normalizeDay(new Date()));
        if (!todayDone) checkDate.setDate(checkDate.getDate() - 1);

        for (let i = sortedHistory.length - 1; i >= 0; i--) {
            const hDate = normalizeDay(sortedHistory[i]);
            if (isSameDay(hDate, checkDate)) {
                if (!isSameDay(hDate, normalizeDay(new Date()))) count++; // increment if not already counted today
                checkDate.setDate(checkDate.getDate() - 1);
            } else if (hDate < checkDate) {
                break; // Gap found
            }
        }
        
        // Final sanity check for count
        user.streakCount = count;
        await user.save();
    }

    const isTodayComplete =
      user.dailyTasksCompleted?.quizCompleted && user.dailyTasksCompleted?.postCreated;

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
