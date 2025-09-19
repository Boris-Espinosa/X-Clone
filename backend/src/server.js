import express from 'express';
import { ENV } from './config/env.js';
import { connectDB } from './config/db.js';
import cors from 'cors';
import { clerkMiddleware } from '@clerk/express';
import userRoutes from './routes/user.route.js';
import postRoutes from './routes/post.route.js';
const app = express();

app.use(cors())
app.use(express.json())
app.use(clerkMiddleware())

app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.use("/api/users", userRoutes)
app.use("/api/posts", postRoutes)

app.use((err, req, res) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ message: err.message || "Internal server error" });
})

const startServer = async () => {
  try {
    await connectDB();

  app.listen(ENV.PORT, () => {
    console.log(`Server is running on http://localhost:${ENV.PORT}`);
  })
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();