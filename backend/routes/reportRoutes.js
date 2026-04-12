import express from "express";
import { submitReport } from "../controllers/reportController.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", auth, submitReport);

export default router;
