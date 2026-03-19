import express from "express"
import protect from "../middleware/authMiddleware.js"

import {
  createPost,
  getPosts,
  addReply,
  deletePost
} from "../controllers/academicController.js"

const router = express.Router()

router.get("/", protect, getPosts)
router.post("/", protect, createPost)
router.post("/:id/reply", protect, addReply)
router.delete("/:id", protect, deletePost)

export default router