import express from "express";
import protect from "../middleware/authMiddleware.js";
import { contentCreationLimiter } from "../middleware/rateLimiter.js";
import cacheMiddleware from "../middleware/cacheMiddleware.js";

import {
  createProject,
  getProjects,
  getProjectById,
  requestJoinProject,
  acceptJoinRequest,
  rejectJoinRequest,
  leaveProject,
  getUserProjects,
  deleteProject
} from "../controllers/projectController.js";

const router = express.Router();

router.post("/", protect, contentCreationLimiter, createProject);
router.get("/", protect, cacheMiddleware({ namespace: "projects", ttl: 1800 }), getProjects);
router.get("/:id", protect, cacheMiddleware({ namespace: "projects", ttl: 1800 }), getProjectById);

router.post("/:id/join", protect, requestJoinProject);

router.post("/:projectId/accept/:userId", protect, acceptJoinRequest);
router.post("/:projectId/reject/:userId", protect, rejectJoinRequest);

router.post("/:id/leave", protect, leaveProject);
router.get("/user/:id", protect, cacheMiddleware({ namespace: "projects", ttl: 1800 }), getUserProjects);

router.delete("/:id", protect, deleteProject)
export default router;
