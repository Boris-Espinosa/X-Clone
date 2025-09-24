import asyncHandler from 'express-async-handler';
import Post from '../models/post.model.js';
import { getAuth } from '@clerk/express';
import User from '../models/user.model.js';
import Comment from '../models/comment.model.js';
import Notification from '../models/notification.model.js';
import cloudinary from '../config/cloudinary.js';

export const getPosts = asyncHandler(async (req, res) => {
    const posts = await Post.find()
        .sort({ createdAt: -1 })
        .populate('user', 'username firstName lastName profilePicture')
        .populate({
            path: 'comments',
            populate: {
                path: 'user',
                select: 'username firstName lastName profilePicture',
            }
        })

    res.status(200).json({ posts });
})

export const getPost = asyncHandler(async (req, res) => {
    const { postId } = req.params;

    const post = await Post.findById(postId)
        .populate('user', 'username firstName lastName profilePicture')
        .populate({
            path: 'comments',
            populate: {
                path: 'user',
                select: 'username firstName lastName profilePicture',
            }
        })

    if (!post) return res.status(404).json({ message: 'Post not found' });

    res.status(200).json({ post });
})

export const getUserPosts = asyncHandler(async (req, res) => {
    const { username } = req.params;

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const posts = await Post.find({ user: user._id })
        .sort({ createdAt: -1 })
        .populate('user', 'username firstName lastName profilePicture')
        .populate({
            path: 'comments',
            populate: {
                path: 'user',
                select: 'username firstName lastName profilePicture',
            }
        })

    res.status(200).json({ posts });
})

export const createPost = asyncHandler(async (req, res) => {
    console.log('Create Post - Starting');
    console.log('Request body:', req.body);
    console.log('Request file:', req.file ? 'File present' : 'No file');
    
    const { userId } = getAuth(req);
    const { content, image } = req.body; // También permitir image en el body
    
    console.log('User ID from Clerk:', userId);
    console.log('Content:', content);
    console.log('Image in body:', image ? 'Present' : 'Not present');

    // Validar que al menos haya contenido O imagen
    if (!content && !req.file && !image) {
        console.log('❌ No content or image provided');
        return res.status(400).json({ message: 'Post content or image is required' });
    }

    const user = await User.findOne({ clerkId: userId });
    if (!user) {
        console.log('❌ User not found for clerkId:', userId);
        return res.status(404).json({ message: 'User not found' });
    }

    console.log('✅ User found:', user.username);

    let imageUrl = '';

    try {
        // Manejar imagen desde req.file (multipart/form-data)
        if (req.file) {
            console.log('📁 Processing file upload');
            console.log('File details:', {
                mimetype: req.file.mimetype,
                size: req.file.size,
                hasBuffer: !!req.file.buffer
            });

            const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

            const uploadResponse = await cloudinary.uploader.upload(base64Image, {
                folder: 'social_media_posts',
                resource_type: 'image',
                transformation: [
                    { width: 800, height: 600, crop: 'limit' },
                    { quality: 'auto' },
                    { format: 'auto' },
                ],
            });
            
            imageUrl = uploadResponse.secure_url;
            console.log('✅ Image uploaded to Cloudinary:', imageUrl);
        }
        // Manejar imagen desde req.body (base64 string)
        else if (image && image.trim() !== '') {
            console.log('📷 Processing base64 image from body');
            
            const uploadResponse = await cloudinary.uploader.upload(image, {
                folder: 'social_media_posts',
                resource_type: 'image',
                transformation: [
                    { width: 800, height: 600, crop: 'limit' },
                    { quality: 'auto' },
                    { format: 'auto' },
                ],
            });
            
            imageUrl = uploadResponse.secure_url;
            console.log('✅ Base64 image uploaded to Cloudinary:', imageUrl);
        }

        const postData = {
            user: user._id,
            content: content || '',
            image: imageUrl,
        };

        console.log('💾 Creating post with data:', postData);

        const post = await Post.create(postData);

        console.log('✅ Post created successfully:', post._id);

        // Populate el post antes de enviarlo
        const populatedPost = await Post.findById(post._id)
            .populate('user', 'username firstName lastName profilePicture');

        res.status(201).json({ 
            post: populatedPost, 
            message: 'Post created successfully' 
        });

    } catch (error) {
        console.error('💥 Error creating post:', error);
        
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                message: 'Validation error', 
                details: error.message 
            });
        }
        
        return res.status(500).json({ 
            message: 'Error creating post', 
            details: error.message 
        });
    }
})

export const likePost = asyncHandler(async (req, res) => {
    const { userId } = getAuth(req);
    const { postId } = req.params;

    const user = await User.findOne({ clerkId: userId });
    const post = await Post.findById(postId); // Post.find()

    if (!user || !post) return res.status(404).json({ message: 'User or post not found' });

    const hasLiked = post.likes.includes(user._id);

    if (hasLiked) {
        await Post.findByIdAndUpdate(postId, {
            $pull: { likes: user._id }
        });
    } else {
        await Post.findByIdAndUpdate(postId, {
            $push: { likes: user._id }
        });

        if (post.user.toString() !== user._id.toString()) {
            await Notification.create({
                from: user._id,
                to: post.user,
                type: 'like',
                post: postId,
            });
        }
    }

    res.status(200).json({ message: hasLiked ? 'Post unliked' : 'Post liked' });
})

export const deletePost = asyncHandler(async (req, res) => {
    const { userId } = getAuth(req);
    const { postId } = req.params;

    const user = await User.findOne({ clerkId: userId });
    const post = await Post.findById(postId); //Post.find()

    if (!user || !post) return res.status(404).json({ message: 'User or post not found' });

    if (post.user.toString() !== user._id.toString()) {
        return res.status(403).json({ message: 'You are not authorized to delete this post' });
    }

    // delete image from cloudinary if exists
    if (post.image) {
        try {
            const publicId = post.image.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(`social_media_posts/${publicId}`);
            console.log('Image deleted from Cloudinary');
        } catch (error) {
            console.error('Error deleting image from Cloudinary:', error);
        }
    }

    await Comment.deleteMany({ post: postId });
    await Post.findByIdAndDelete(postId);
    
    res.status(200).json({ message: 'Post deleted successfully' });
})