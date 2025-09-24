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
    console.log('🚀 Create Post - Starting');
    console.log('Request body:', req.body);
    console.log('Request file:', req.file ? 'File present' : 'No file');
    
    const { userId } = getAuth(req);
    const { content, image } = req.body;
    
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
        // Verificar configuración de Cloudinary ANTES de subir
        console.log('🔧 Cloudinary Environment Check:');
        console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME ? 'Present' : 'Missing');
        console.log('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY ? 'Present' : 'Missing');
        console.log('CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? 'Present' : 'Missing');

        // Manejar imagen desde req.file (multipart/form-data)
        if (req.file) {
            console.log('📁 Processing file upload');
            console.log('File details:', {
                mimetype: req.file.mimetype,
                size: req.file.size,
                hasBuffer: !!req.file.buffer
            });

            try {
                const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
                
                console.log('📋 Base64 image size:', base64Image.length, 'characters');
                console.log('📤 Attempting Cloudinary upload...');

                const uploadResponse = await cloudinary.uploader.upload(base64Image, {
                    folder: 'social_media_posts',
                    resource_type: 'image',
                    transformation: [
                        { width: 800, height: 600, crop: 'limit' },
                        { quality: 'auto' },
                        { format: 'auto' },
                    ],
                });
                
                console.log('📤 Cloudinary upload response:', {
                    public_id: uploadResponse.public_id,
                    secure_url: uploadResponse.secure_url,
                    format: uploadResponse.format,
                    bytes: uploadResponse.bytes
                });
                
                imageUrl = uploadResponse.secure_url;
                console.log('✅ Image uploaded to Cloudinary:', imageUrl);
                
            } catch (cloudinaryError) {
                console.error('💥 Cloudinary upload failed:', {
                    message: cloudinaryError.message,
                    name: cloudinaryError.name,
                    http_code: cloudinaryError.http_code
                });
                
                // Intentar upload más simple como fallback
                console.log('🔄 Retrying with simpler upload...');
                try {
                    const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
                    
                    const simpleUpload = await cloudinary.uploader.upload(base64Image, {
                        resource_type: 'image',
                        transformation: [
                            { width: 800, crop: 'scale' }
                        ],
                    });
                    
                    imageUrl = simpleUpload.secure_url;
                    console.log('✅ Simple upload successful:', imageUrl);
                    
                } catch (simpleError) {
                    console.error('💥 Simple upload also failed:', simpleError.message);
                    
                    // Si no hay contenido y falla la imagen, es error
                    if (!content || content.trim() === '') {
                        return res.status(400).json({ 
                            message: 'Failed to upload image and no text content provided',
                            error: simpleError.message
                        });
                    }
                    
                    // Si hay contenido, continuar sin imagen
                    console.log('⚠️ Continuing without image...');
                    imageUrl = '';
                }
            }
        }
        // Manejar imagen desde req.body (base64 string)
        else if (image && image.trim() !== '') {
            console.log('📷 Processing base64 image from body');
            
            try {
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
                
            } catch (cloudinaryError) {
                console.error('💥 Cloudinary base64 upload failed:', cloudinaryError);
                
                if (!content || content.trim() === '') {
                    return res.status(400).json({ 
                        message: 'Failed to upload image and no text content provided',
                        error: cloudinaryError.message
                    });
                }
                
                console.log('⚠️ Continuing without image...');
                imageUrl = '';
            }
        }

        const postData = {
            user: user._id,
            content: content || '',
            image: imageUrl,
        };

        console.log('💾 Creating post with data:', {
            userId: postData.user,
            contentLength: postData.content.length,
            hasImage: !!postData.image,
            imageUrl: postData.image ? 'Present' : 'None'
        });

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
        console.error('💥 Error creating post:', {
            name: error.name,
            message: error.message,
            stack: error.stack?.substring(0, 500) // Limitar stack trace
        });
        
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
    const post = await Post.findById(postId);

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
    const post = await Post.findById(postId);

    if (!user || !post) return res.status(404).json({ message: 'User or post not found' });

    if (post.user.toString() !== user._id.toString()) {
        return res.status(403).json({ message: 'You are not authorized to delete this post' });
    }

    // Eliminar imagen de cloudinary si existe
    if (post.image) {
        try {
            const publicId = post.image.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(`social_media_posts/${publicId}`);
            console.log('✅ Image deleted from Cloudinary');
        } catch (error) {
            console.error('❌ Error deleting image from Cloudinary:', error);
        }
    }

    await Comment.deleteMany({ post: postId });
    await Post.findByIdAndDelete(postId);
    
    res.status(200).json({ message: 'Post deleted successfully' });
})