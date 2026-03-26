import express from "express";
import protect from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

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

router.post("/", protect, upload.single("image"), createEvent);
router.get("/", protect, getEvents);
router.get("/:id", protect, getEventById);
router.post("/:id/register", protect, registerEvent);
router.post("/:id/cancel", protect, cancelRegistration);
router.get("/user/:id", protect, getUserEvents);
router.delete("/:id", protect, deleteEvent)
export default router;
