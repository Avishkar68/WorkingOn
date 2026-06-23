import express from "express";
import protect from "../middleware/authMiddleware.js";
import { contentCreationLimiter } from "../middleware/rateLimiter.js";

import {
  createCommunity,
  getAllCommunities,
  getSingleCommunity,
  joinCommunity,
  leaveCommunity,
  getUserCommunities
} from "../controllers/communityController.js";

const router = express.Router();

// ✅ CREATE
router.post("/", protect, contentCreationLimiter, createCommunity);

// ✅ GET ALL (Home page)
router.get("/", protect, getAllCommunities);

// ✅ GET ONE
router.get("/:id", protect, getSingleCommunity);

// ✅ JOIN / LEAVE
router.post("/:id/join", protect, joinCommunity);
router.post("/:id/leave", protect, leaveCommunity);

// ✅ USER COMMUNITIES (sidebar)
router.get("/user/me", protect, getUserCommunities);

export default router;