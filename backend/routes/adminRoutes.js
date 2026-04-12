// routes/adminRoutes.js

import express from "express";
import protect from "../middleware/authMiddleware.js";
import admin from "../middleware/adminMiddleware.js";

import {
  getAdminStats,
  getReportedPosts,
  getUnifiedReports,
  resolveReport,
  deletePostAdmin,
  banUser,
  unbanUser,
  pinPost,
  getAllUsers,
  deleteUserAdmin,
  deleteCommunityAdmin,
  deleteEventAdmin,
  deleteProjectAdmin,
  deleteOpportunityAdmin,
  uploadChallenges,
  deletePulseAdmin,
  getAllPulsesAdmin,
  restorePulseAdmin,
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/users", protect, admin, getAllUsers);

router.get("/stats", protect, admin, getAdminStats);

router.get("/reported-posts", protect, admin, getReportedPosts);
router.get("/reports", protect, admin, getUnifiedReports);
router.post("/reports/:id/resolve", protect, admin, resolveReport);

router.delete("/post/:id", protect, admin, deletePostAdmin);

router.post("/ban-user/:id", protect, admin, banUser);
router.post("/unban-user/:id", protect, admin, unbanUser);

router.post("/pin-post/:id", protect, admin, pinPost);

// 💥 Extreme Authority / Deletion Endpoints
router.delete("/user/:id", protect, admin, deleteUserAdmin);
router.delete("/community/:id", protect, admin, deleteCommunityAdmin);
router.delete("/event/:id", protect, admin, deleteEventAdmin);
router.delete("/project/:id", protect, admin, deleteProjectAdmin);
router.delete("/opportunity/:id", protect, admin, deleteOpportunityAdmin);
router.delete("/pulse/:id", protect, admin, deletePulseAdmin);
router.get("/pulses", protect, admin, getAllPulsesAdmin);
router.post("/pulse/:id/restore", protect, admin, restorePulseAdmin);

router.post("/challenges/upload", protect, admin, uploadChallenges);

export default router;
