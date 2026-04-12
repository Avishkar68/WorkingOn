import express from "express";
import { 
  createPulse, 
  getAllPulses, 
  reactToPulse, 
  voteInPoll, 
  reportPulse,
  votePulse
} from "../controllers/pulseController.js";
import auth from "../middleware/authMiddleware.js";
import multer from "multer";

const upload = multer({ dest: "uploads/" });
const router = express.Router();

router.get("/", auth, getAllPulses);
router.post("/", auth, upload.single("image"), createPulse);
router.post("/:id/react", auth, reactToPulse);
router.post("/:id/vote", auth, voteInPoll);
router.post("/:id/vote-pulse", auth, votePulse);
router.post("/:id/report", auth, reportPulse);

export default router;
