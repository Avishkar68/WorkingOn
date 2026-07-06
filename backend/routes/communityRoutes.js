import express from "express";
import protect from "../middleware/authMiddleware.js";
import { contentCreationLimiter } from "../middleware/rateLimiter.js";
import cacheMiddleware from "../middleware/cacheMiddleware.js";

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
router.get("/", protect, cacheMiddleware({ namespace: "communities", ttl: 1800 }), getAllCommunities);

// ✅ GET ONE
router.get("/:id", protect, cacheMiddleware({ namespace: "communities", ttl: 1800 }), getSingleCommunity);

// ✅ JOIN / LEAVE
router.post("/:id/join", protect, joinCommunity);
router.post("/:id/leave", protect, leaveCommunity);

// ✅ USER COMMUNITIES (sidebar)
router.get("/user/me", protect, cacheMiddleware({ namespace: "communities", ttl: 1800, userSpecific: true }), getUserCommunities);

export default router;