// routes/notificationRoutes.js

import express from "express";
import protect from "../middleware/authMiddleware.js";

import {
  getNotifications,
  markAsRead,
  markAllRead,
  deleteNotification,
  getUnreadCount
} from "../controllers/notificationController.js";

const router = express.Router();

router.use((req, res, next) => {
  console.log(`🔔 [NotificationRouter] ${req.method} ${req.url}`);
  next();
});

router.get("/unread-total", protect, getUnreadCount);
router.get("/", protect, getNotifications);

router.put("/:id/read", protect, markAsRead);

router.put("/read-all", protect, markAllRead);

router.delete("/:id", protect, deleteNotification);

export default router;
