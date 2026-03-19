import express from "express";
import {
  registerUser,
  loginUser,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getCurrentUser,
  changePassword
} from "../controllers/authController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();
router.put("/change-password", protect, changePassword);
router.post("/register", registerUser);
router.post("/login", loginUser);

router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

router.get("/me", protect, getCurrentUser);   // 👈 ADD THIS

export default router;