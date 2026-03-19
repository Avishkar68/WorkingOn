// routes/adminRoutes.js

import express from "express";
import protect from "../middleware/authMiddleware.js";
import admin from "../middleware/adminMiddleware.js";

import {
  getAdminStats,
  getReportedPosts,
  deletePostAdmin,
  banUser,
  unbanUser,
  pinPost,
  getAllUsers
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/users", protect, admin, getAllUsers);

router.get("/stats", protect, admin, getAdminStats);

router.get("/reported-posts", protect, admin, getReportedPosts);

router.delete("/post/:id", protect, admin, deletePostAdmin);

router.post("/ban-user/:id", protect, admin, banUser);
router.post("/unban-user/:id", protect, admin, unbanUser);

router.post("/pin-post/:id", protect, admin, pinPost);

export default router;
