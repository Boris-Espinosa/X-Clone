import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js"
import { createComment, deleteComment, getComments, likeComment } from "../controllers/comment.controller.js"

const router = express.Router()

// Get comments for a post
router.get("/post/:postId", getComments)

// Create comment on a post
router.post("/post/:postId", protectRoute, createComment)

// Like/unlike a comment
router.post("/:commentId/like", protectRoute, likeComment)

// Delete a comment
router.delete("/:commentId", protectRoute, deleteComment)

export default router