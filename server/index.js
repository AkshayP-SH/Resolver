import "dotenv/config";
import express from "express";
import connectDB from "./src/config/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./src/routers/auth.router.js";
import {protect , adminOnly} from './src/middleware/authMiddleware.js';
import complaintRouter from './src/routers/complaint.router.js';
import commentRouter from './src/routers/comment.router.js';
import userRouter from './src/routers/user.router.js';
import publicRouter from './src/routers/public.router.js';
import helmet from 'helmet';
import { apiLimiter, authLimiter } from "./src/middleware/rateLimiter.js";
import notificationRouter from './src/routers/notification.router.js';

const allowedOrigins = process.env.CLIENT_ORIGIN 
    ? process.env.CLIENT_ORIGIN.split(',') 
    : ['http://localhost:5173'];

const app = express();
app.set("trust proxy", 1);
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(cors({
    origin: function(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));


const PORT = process.env.PORT;

async function startserver() {
  try{
    await connectDB();
    app.use('/api/auth',authLimiter);
    app.use('/api',apiLimiter);
    app.use("/api/auth",router);
    app.use('/api/public', publicRouter);
    app.use('/api/complaints', protect, complaintRouter);
    app.use('/api/comments',protect, commentRouter);
    app.use('/api/users', protect, userRouter);
    app.use('/api/notifications', notificationRouter);

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    })
  } catch (e) {
    console.error("theres a db error or auth error",e);
    process.exit(1);
  }

}

startserver();
