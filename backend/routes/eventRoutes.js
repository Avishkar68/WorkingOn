import express from "express";
import protect from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";
import { contentCreationLimiter } from "../middleware/rateLimiter.js";
import cacheMiddleware from "../middleware/cacheMiddleware.js";

import {
  createEvent,
  getEvents,
  getEventById,
  registerEvent,
  cancelRegistration,
  getUserEvents,
  deleteEvent
} from "../controllers/eventController.js";
import { get } from "mongoose";

const router = express.Router();

router.post("/", protect, contentCreationLimiter, upload.single("image"), createEvent);
router.get("/", protect, cacheMiddleware({ namespace: "events", ttl: 1800 }), getEvents);
router.get("/:id", protect, cacheMiddleware({ namespace: "events", ttl: 1800 }), getEventById);
router.post("/:id/register", protect, registerEvent);
router.post("/:id/cancel", protect, cancelRegistration);
router.get("/user/:id", protect, cacheMiddleware({ namespace: "events", ttl: 1800 }), getUserEvents);
router.delete("/:id", protect, deleteEvent)
export default router;
