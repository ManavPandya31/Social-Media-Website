import express from 'express';
import cors from 'cors';
import compression from 'compression';
import { errorHandler } from "./Middlewares/error.middleware.js";
import authRouter from "./Routes/Auth.route.js";
import userRouter from "./Routes/User.route.js";
import postRouter from "./Routes/Post.route.js";
import commentRouter from "./Routes/Comments.route.js";
import adminRouter from "./Routes/Admin.route.js";

const app = express();

app.use(cors());
app.use(compression());
app.use(express.json());    
app.use(express.urlencoded({ extended: true }));
app.use(errorHandler);

app.use("/api/auth",authRouter);
app.use("/api/user",userRouter);
app.use("/api/post",postRouter);
app.use("/api/comments",commentRouter);
app.use("/api/admin",adminRouter);

export default app;