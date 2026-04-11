import express from "express";
import protect from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

import {
  createPost,
  getFeed,
  getCommunityPosts,   // ⭐ NEW IMPORT
  likePost,
  unlikePost,
  deletePost,
  reportPost,
  getUserPosts,
  getPostById
} from "../controllers/postController.js";

const router = express.Router();

// ✅ CREATE POST (WITH IMAGE + COMMUNITY)
router.post("/", protect, upload.single("image"), createPost);

// ✅ GLOBAL FEED (optional)
router.get("/feed", protect, getFeed);

// ⭐ NEW → COMMUNITY POSTS
router.get("/community/:communityId", protect, getCommunityPosts);

// ✅ GET SINGLE POST
router.get("/:id", protect, getPostById);

// ❤️ LIKE / UNLIKE
router.post("/:id/like", protect, likePost);
router.post("/:id/unlike", protect, unlikePost);

// 🗑 DELETE
router.delete("/:id", protect, deletePost);

// 🚨 REPORT
router.post("/:id/report", protect, reportPost);

// 👤 USER POSTS
router.get("/user/:id", protect, getUserPosts);

export default router;