import express from 'express';
import mongoose from 'mongoose';
import { ENV } from './config/env.js';
import { connectDB } from './config/db.js';
import cors from 'cors';
import { clerkMiddleware } from '@clerk/express';
import userRoutes from './routes/user.route.js';
import postRoutes from './routes/post.route.js';
import commentRoutes from "./routes/comment.route.js"
import { arcjetMiddleware } from './middleware/arcjet.middleware.js';
import notificationRoutes from './routes/notification.route.js';
const app = express();

app.set('trust proxy', 1)
app.use(cors({ origin: ENV.FRONTEND_URL }))
app.use(express.json())
app.use(clerkMiddleware())
app.use(arcjetMiddleware)

app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.use('/api', (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ message: 'Database unavailable' });
  }
  next();
})

app.use("/api/users", userRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/comments", commentRoutes)
app.use("/api/notifications", notificationRoutes)

// Global error handler
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    if (err.name === 'MongooseError' || err.name === 'MongoServerError') {
      return res.status(503).json({ message: 'Database unavailable' });
    }
    res.status(500).json({ message: err.message || "Internal server error" });
})

app.listen(ENV.PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${ENV.PORT}`);
});

connectDB();

export default app;