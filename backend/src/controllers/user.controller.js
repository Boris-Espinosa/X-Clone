import asyncHandler from 'express-async-handler'
import User from '../models/user.model.js'
import Notification from '../models/notification.model.js'
import { clerkClient, getAuth } from '@clerk/express'
import cloudinary from '../config/cloudinary.js'

export const getUserProfile = asyncHandler(async (req, res) => {
    const { username } = req.params
    const user = await User.findOne({ username })
    if (!user) return res.status(404).json({ error: 'User not found' })

    res.status(200).json({ user })
})

export const updateProfilePicture = asyncHandler(async (req, res) => {
    const { userId } = getAuth(req)
    const user = await User.findOne({ clerkId: userId })
    if (!user) return res.status(404).json({ error: 'User not found' })

    if (!req.file) return res.status(400).json({error: "Profile picture is required"})
    
    const profilePictureId = user.profilePicture.split("/").pop().split(".")[0]
    try {
        cloudinary.uploader.destroy(`user_profile_pictures/${profilePictureId}`)
    } catch (error) {
        //continue if it fails
    }
    let profilePictureUrl = ""
    try {
        try {
            const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    
            const uploadResponse = await cloudinary.uploader.upload(base64Image, {
                folder: "user_profile_pictures",
                resource_type: "image",
                transformation: [
                    { quality: "auto" },
                    { format: "auto" },
                    { width: 1080, height: 1080, crop: "limit" }
                ]
            })
            profilePictureUrl = uploadResponse.secure_url
        } catch (cloudinaryError) {
            return res.status(500).json({error: "Failed to upload image"})
        }
        const updatedUser = await User.findOneAndUpdate({clerkId: userId},
            {profilePicture: profilePictureUrl},
            {new: true}
        )
        res.status(200).json({user: updatedUser, message: "User profile picture updated succesfully"})
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: 'Validation error',
                details: error.message
            });
        }
        return res.status(500).json({
            error: "Failed to update profile picture",
            details: error.message
        })
    }
})

export const updateProfileBanner = asyncHandler(async (req, res) => {
    const { userId } = getAuth(req)
    const user = await User.findOne({ clerkId: userId })
    if (!user) return res.status(404).json({ error: 'User not found' })
    
    if (!req.file) return res.status(400).json({ error: 'Banner image is required' })
    
    let bannerImageUrl = ""

    const bannerId = user.bannerImage.split('/').pop().split('.')[0];
    await cloudinary.uploader.destroy(`user_banners/${bannerId}`);
    try {
        try {
            const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

            const uploadResponse = await cloudinary.uploader.upload(base64Image, {
                folder: 'user_banners',
                resource_type: 'image',
                transformation: [
                    { width: 1000, height: 500, crop: 'limit' },
                    { quality: 'auto' },
                    { format: 'auto' },
                ],
            });
            
            bannerImageUrl = uploadResponse.secure_url;
            
        } catch (cloudinaryError) {
            
            try {
                const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
                
                const simpleUpload = await cloudinary.uploader.upload(base64Image, {
                    folder: 'user_banners',
                    resource_type: 'image',
                    transformation: [
                        { width: 1000, height: 500, crop: 'scale' }
                    ],
                });
                
                bannerImageUrl = simpleUpload.secure_url;
                
            } catch (simpleError) {
                return res.status(500).json({ 
                    message: 'Failed to upload banner image',
                    error: simpleError.message
                });
            }
        }
        
        
        const updatedUser = await User.findOneAndUpdate(
            { clerkId: userId }, 
            { bannerImage: bannerImageUrl }, 
            { new: true }
        )
        
        res.status(200).json({ 
            user: updatedUser,
            message: 'Banner updated successfully' 
        })
        
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                message: 'Validation error', 
                details: error.message 
            });
        }
        
        return res.status(500).json({ 
            message: 'Error updating banner', 
            details: error.message 
        });
    }
})

export const updateProfile = asyncHandler(async (req, res) => {
    const { userId } = getAuth(req)
    const clerkUser = await clerkClient.users.getUser(userId)
    const user = await User.findOneAndUpdate({ clerkId: userId }, req.body, { new: true })
    if (!user) return res.status(404).json({ error: 'User not found' })
    
    res.status(200).json({ user })
})

export const syncUser = asyncHandler(async (req, res) => {
    const { userId } = getAuth(req)

    const existingUser = await User.findOne({ clerkId: userId })
    if (existingUser) return res.status(200).json({ user: existingUser, message: 'User already exists' })

    const clerkUser = await clerkClient.users.getUser(userId)

    const userData = {
        clerkId: userId,
        email: clerkUser.emailAddresses[0].emailAddress,
        firstName: clerkUser.firstName || '',
        lastName: clerkUser.lastName || '',
        username: clerkUser.emailAddresses[0].emailAddress.split("@")[0] || `user${Math.floor(Math.random() * 10000)}`,
        profilePicture: clerkUser.imageUrl || '',
    }

    const user = await User.create(userData)

    res.status(201).json({ user, message: 'User created successfully'})
})

export const getCurrentUser = asyncHandler(async (req, res) => {
    const { userId } = getAuth(req)
    const user = await User.findOne({ clerkId: userId })
        .populate({
            path: 'followers',
            select: 'clerkId username firstName lastName profilePicture'
        })
        .populate({
            path: 'following',
            select: 'clerkId username firstName lastName profilePicture'
        })
    if (!user) return res.status(404).json({ error: 'User not found' })

    res.status(200).json({ user })
})

export const followUser = asyncHandler(async (req, res) => {
    const { userId } = getAuth(req)
    const { targetUserId } = req.params

    if (userId === targetUserId) {
        return res.status(400).json({ error: "You cannot follow yourself" })
    }

    const currentUser = await User.findOne({ clerkId: userId })
    const targetUser = await User.findOne({ clerkId: targetUserId })

    if (!targetUser || !currentUser) {
        return res.status(404).json({ error: "User not found" })
    }

    const isFollowing = currentUser.following.some(followedId => followedId.toString() === targetUser._id.toString())

    if (isFollowing) {
        await User.findByIdAndUpdate(currentUser._id, {
            $pull: { following: targetUser._id }
        })
        await User.findByIdAndUpdate(targetUser._id, {
            $pull: { followers: currentUser._id }
        })
    } else {
        await User.findByIdAndUpdate(currentUser._id, {
            $push: { following: targetUser._id }
        })
        await User.findByIdAndUpdate(targetUser._id, {
            $push: { followers: currentUser._id }
        })

        await Notification.create({
            from: currentUser._id,
            to: targetUser._id,
            type: 'follow',
        })
    }
      
    res.status(200).json({ message: isFollowing ? 'User unfollowed' : 'User followed' })
})

