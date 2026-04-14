import { Router } from "express";
import { verifyJwtToken } from "../Middlewares/Auth.middleware.js";
import { upload } from "../Middlewares/multer.middleware.js";
import { createPost , deletePost , likeUnlike , getFeed , getMyPosts} from "../Controllers/post.controller.js";

const router = Router();

router.route("/createPost").post(verifyJwtToken, upload.single("media"),createPost);
router.route("/deletePost/:postId").delete(verifyJwtToken,deletePost);
router.route("/likeUnlikePost/:postId").post(verifyJwtToken,likeUnlike);
router.route("/getFeed").get(verifyJwtToken,getFeed);
router.route("/getMyPosts").get(verifyJwtToken,getMyPosts);

export default router;