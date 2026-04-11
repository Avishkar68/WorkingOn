import express from "express";
import protect from "../middleware/authMiddleware.js";
import { getCommunityMessages } from "../controllers/messageController.js";

const router = express.Router();

router.get("/:communityId", protect, getCommunityMessages);

export default router;
