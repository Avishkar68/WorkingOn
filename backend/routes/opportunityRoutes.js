// routes/opportunityRoutes.js

import express from "express";
import protect from "../middleware/authMiddleware.js";

import {
  createOpportunity,
  getOpportunities,
  getOpportunityById,
  applyOpportunity,
  closeOpportunity,
  getUserOpportunities,
  deleteOpportunity
} from "../controllers/opportunityController.js";

const router = express.Router();

router.post("/", protect, createOpportunity);

router.get("/", protect, getOpportunities);
router.get("/:id", protect, getOpportunityById);

router.post("/:id/apply", protect, applyOpportunity);

router.put("/:id/close", protect, closeOpportunity);
router.get("/user/:id", protect, getUserOpportunities);
router.delete("/:id", protect, deleteOpportunity)

export default router;
