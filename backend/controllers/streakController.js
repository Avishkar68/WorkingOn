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

  resetDailyTasksIfNewDay(user);

  const { quizCompleted, postCreated } = user.dailyTasksCompleted || {};
  const alreadyRecorded = user.streakHistory?.some((day) => isSameDay(day, today));

  if (!quizCompleted || !postCreated || alreadyRecorded) {
    user.lastActiveDate = user.lastActiveDate || undefined;
    await user.save();
    return { updated: false, alreadyRecorded };
  }

  const lastDate = user.lastActiveDate ? normalizeDay(user.lastActiveDate) : null;
  const nextStreak = lastDate && isYesterday(lastDate, today) ? user.streakCount + 1 : 1;

  user.streakCount = nextStreak;
  user.lastActiveDate = today;
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
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  resetDailyTasksIfNewDay(user);
  const today = normalizeDay(new Date());
  user.lastActiveDate = today;
  user.dailyTasksCompleted.quizCompleted = true;
  await user.save();

  return tryUpdateStreakIfReady(user);
};

export const markPostCreated = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  resetDailyTasksIfNewDay(user);
  const today = normalizeDay(new Date());
  user.lastActiveDate = today;
  user.dailyTasksCompleted.postCreated = true;
  await user.save();

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
    resetDailyTasksIfNewDay(user);
    if (JSON.stringify(user.dailyTasksCompleted) !== originalTasks) {
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
