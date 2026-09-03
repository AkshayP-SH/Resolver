import "dotenv/config";
import express from "express";
import connectDB from "./src/config/db.js";
import cors from "cors";
import router from "./src/routers/auth.router.js";
import protect from './src/middleware/authMiddleware.js';
import complaintRouter from './src/routers/complaint.router.js';
import commentRouter from './src/routers/comment.router.js';
import userRouter from './src/routers/user.router.js';
import publicRouter from './src/routers/public.router.js';




const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT;

async function startserver() {
  try{
    await connectDB();
    app.use("/api/auth",router);
    app.use('/api/public', publicRouter);
    app.use('/api/complaints', protect, complaintRouter);
    app.use('/api/comments',protect, commentRouter);
    app.use('/api/users', protect, userRouter);

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    })
  } catch (e) {
    console.error("theres a db error or auth error",e);
    process.exit(1);
  }

}

startserver();
