// routes/notificationRoutes.js

import express from "express";
import protect from "../middleware/authMiddleware.js";

import {
  getNotifications,
  markAsRead,
  markAllRead,
  deleteNotification
} from "../controllers/notificationController.js";

const router = express.Router();

router.get("/", protect, getNotifications);

router.put("/:id/read", protect, markAsRead);

router.put("/read-all", protect, markAllRead);

router.delete("/:id", protect, deleteNotification);

export default router;
