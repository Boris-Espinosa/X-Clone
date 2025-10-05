import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js"
import { createComment, deleteComment, getComments, likeComment } from "../controllers/comment.controller.js"

const router = express.Router()

router.get("/post/:postId", getComments)

router.post("/post/:commentId", protectRoute, likeComment)
router.post("/post/:postId", protectRoute, createComment)
router.delete("/:commentId", protectRoute, deleteComment)

export default router