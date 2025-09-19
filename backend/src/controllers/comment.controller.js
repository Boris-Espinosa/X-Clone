import AsyncHandler from "express-async-handler"
import Comment from "../models/comment.model.js"
import { getAuth } from "@clerk/express"
import Post from "../models/post.model.js"
import User from "../models/user.model.js"
import Notification from "../models/notification.model.js"

export const getComments = AsyncHandler(async (req, res) => {
    const { postId } = req.params

    const comments = await Comment.find({ post: postId })
        .sort({ createdAt: -1 })
        .populate("user", "username firstName lastName profileImage")

    res.status(200).json({ comments })
})

export const createComment = AsyncHandler(async (req, res) => {
    const { postId } = req.params
    const { content } = req.body
    const { userId } = getAuth(req)

    if (!content || content.trim() === "") {
        return res.status(400).json({ message: "Comment content cannot be empty" })
    }

    const post = await Post.findById(postId)
    const user = await User.findOne({ clerkId: userId })

    if (!user || !post) {
        return res.status(404).json({ message: "User or Post not found" })
    }

    const comment = await Comment.create({
        user: user._id,
        post: postId,
        content,
    })

    await Post.findByIdAndUpdate(postId, {
        $push: { comments: comment._id }
    })

    if (post.user.toString() !== user._id.toString()) {
        await Notification.create({
            from: user._id,
            to: post.user,
            type: "comment",
            post: postId,
            comment: comment._id,
        })
    }

    res.status(201).json({ comment })
})

export const deleteComment = AsyncHandler(async (req, res) => {
    const { commentId } = req.params
    const { userId } = getAuth(req)
    const user = await User.findOne({ clerkId: userId })
    const comment = await Comment.findById(commentId)

    if (!user || !comment) {
        return res.status(404).json({ message: "User or Comment not found" })
    }

    if (comment.user.toString() !== user._id.toString()) {
        return res.status(403).json({ message: "You are not authorized to delete this comment" })
    }

    await Post.findByIdAndDelete(comment.post, {
        $pull: { comments: comment._id }
    })

    await Comment.findByIdAndDelete(commentId)

    res.status(200).json({ message: "Comment deleted successfully" })
})