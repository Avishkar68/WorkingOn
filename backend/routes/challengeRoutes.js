import express from "express";
import protect from "../middleware/authMiddleware.js";
import { getTodayChallenge, completeChallenge } from "../controllers/challengeController.js";

const router = express.Router();

router.get("/today", protect, getTodayChallenge);
router.post("/complete", protect, completeChallenge);

export default router;
