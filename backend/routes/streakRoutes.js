import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  handleStreakUpdate,
  getLeaderboard,
  getStreakStatus,
  markPostCreated
} from "../controllers/streakController.js";

const router = express.Router();

router.post("/post-created", protect, async (req, res) => {
  try {
    const result = await markPostCreated(req.user._id);
    res.json({
      message: "Post marked for streak",
      streakUpdated: result.updated,
      streakCount: result.streakCount,
      streakHistory: result.streakHistory
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to mark post completion" });
  }
});

router.post("/update", protect, handleStreakUpdate);
router.get("/leaderboard", protect, getLeaderboard);
router.get("/status", protect, getStreakStatus);

export default router;
