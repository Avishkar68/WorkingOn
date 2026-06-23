import express from "express";
import {
  registerUser,
  loginUser,
  getCurrentUser
} from "../controllers/authController.js";

import protect from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";
import { authLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();
router.post("/register", authLimiter, upload.single("profileImage"), registerUser);
router.post("/login", authLimiter, loginUser);
router.get("/me", protect, getCurrentUser);

export default router;