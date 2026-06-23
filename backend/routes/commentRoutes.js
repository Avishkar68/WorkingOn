import express from "express";
import protect from "../middleware/authMiddleware.js";
import { contentCreationLimiter } from "../middleware/rateLimiter.js";

import {
  addComment,
  getComments,
  deleteComment,
  likeComment
} from "../controllers/commentController.js";

const router = express.Router();

router.post("/", protect, contentCreationLimiter, addComment);
router.get("/:postId", protect, getComments);

router.delete("/:id", protect, deleteComment);

router.post("/:id/like", protect, likeComment);

export default router;
