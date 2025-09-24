import { v2 as cloudinary } from 'cloudinary';

console.log('🔧 Initializing Cloudinary...');
console.log('Environment check:');
console.log('- CLOUDINARY_CLOUD_NAME:', !!process.env.CLOUDINARY_CLOUD_NAME);
console.log('- CLOUDINARY_API_KEY:', !!process.env.CLOUDINARY_API_KEY); 
console.log('- CLOUDINARY_API_SECRET:', !!process.env.CLOUDINARY_API_SECRET);

if (process.env.CLOUDINARY_API_KEY) {
    console.log('- API_KEY preview:', process.env.CLOUDINARY_API_KEY.substring(0, 6) + '***');
}

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

console.log('✅ Cloudinary configured');

export default cloudinary;