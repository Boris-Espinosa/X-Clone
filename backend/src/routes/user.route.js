import express from 'express'
import { followUser, getCurrentUser, getUserProfile, syncUser, updateProfile, updateProfileBanner } from '../controllers/user.controller.js'
import { protectRoute } from '../middleware/auth.middleware.js'
import upload from '../middleware/upload.middleware.js'

const router = express.Router()

router.get("/profile/:username", getUserProfile)

router.post("/sync", protectRoute, syncUser)
router.get("/me", protectRoute, getCurrentUser)
router.put("/profile", protectRoute, updateProfile)
router.put("/profile/banner", protectRoute, upload.single('bannerImage'),updateProfileBanner)
router.post("/follow/:targetUserId", protectRoute, followUser)

export default router