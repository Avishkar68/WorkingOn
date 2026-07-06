import express from "express";
import protect from "../middleware/authMiddleware.js";
import cacheMiddleware from "../middleware/cacheMiddleware.js";

import {
  getTrendingPosts,
  getTrendingTags
} from "../controllers/exploreController.js";

const router = express.Router();

router.get("/posts", protect, cacheMiddleware({ namespace: "explore", ttl: 300 }), getTrendingPosts);
router.get("/tags", protect, cacheMiddleware({ namespace: "explore", ttl: 300 }), getTrendingTags);

export default router;
