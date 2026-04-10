import express from 'express';
import cors from 'cors';
import compression from 'compression';
import userRoutes from "./Routers/User.route.js";
import postRouter from "./Routers/Post.route.js";
import storyRouter from "./Routers/Story.route.js";

const app = express();

app.use(cors());
app.use(compression());
app.use(express.json());    
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth",userRoutes);
app.use("/api/v1/posts",postRouter);
app.use("/api/v1/story",storyRouter);

export default app;