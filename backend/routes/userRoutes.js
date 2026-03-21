import express from "express";
import protect from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";
import {
  getUserProfile,
  updateProfile,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing
} from "../controllers/userController.js";
import { getCurrentUser } from "../controllers/authController.js";

const router = express.Router();

router.get("/me", protect, getCurrentUser);

router.get("/:id", protect, getUserProfile);
router.put("/update", protect, upload.single("image"), updateProfile);

router.post("/:id/follow", protect, followUser);
router.post("/:id/unfollow", protect, unfollowUser);

router.get("/:id/followers", protect, getFollowers);
router.get("/:id/following", protect, getFollowing);

export default router;
