import mongoose from 'mongoose';
import { ENV } from './env.js';

export const connectDB = async () => {
    if (!ENV.MONGO_URI) {
        console.error('MongoDB connection failed: MONGO_URI is not defined');
        return;
    }

    try {
        await mongoose.connect(ENV.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
            bufferCommands: false,
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
    }
}
