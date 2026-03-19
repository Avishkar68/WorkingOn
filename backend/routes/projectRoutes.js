import express from "express";
import protect from "../middleware/authMiddleware.js";

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

router.post("/", protect, createProject);
router.get("/", protect, getProjects);
router.get("/:id", protect, getProjectById);

router.post("/:id/join", protect, requestJoinProject);

router.post("/:projectId/accept/:userId", protect, acceptJoinRequest);
router.post("/:projectId/reject/:userId", protect, rejectJoinRequest);

router.post("/:id/leave", protect, leaveProject);
router.get("/user/:id", protect, getUserProjects);

router.delete("/:id", protect, deleteProject)
export default router;
