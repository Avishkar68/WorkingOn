import express from "express";
import protect from "../middleware/authMiddleware.js";

import {
  getTrendingPosts,
  getTrendingTags
} from "../controllers/exploreController.js";

const router = express.Router();

router.get("/posts", protect, getTrendingPosts);
router.get("/tags", protect, getTrendingTags);

export default router;
