import express from "express";
import protect from "../middleware/authMiddleware.js";

import {
  createPost,
  getFeed,
  likePost,
  unlikePost,
  deletePost,
  reportPost,
  getUserPosts
} from "../controllers/postController.js";

const router = express.Router();

router.post("/", protect, createPost);
router.get("/feed", protect, getFeed);

router.post("/:id/like", protect, likePost);
router.post("/:id/unlike", protect, unlikePost);

router.delete("/:id", protect, deletePost);

router.post("/:id/report", protect, reportPost);
router.get("/user/:id", protect, getUserPosts);

export default router;
