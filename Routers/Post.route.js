import { Router } from "express";
import { upload } from "../Middlewares/Multer.middleware.js";
import { verifyJwtToken } from "../Middlewares/Auth.middleware.js";
import { createPost , getPost , deletePost , isLiked , addComment , deleteComment} from "../Controllers/Post.controller.js";

const router = Router();

router.route("/createPost").post(verifyJwtToken,upload.single("image"),createPost);
router.route("/getPost").get(getPost);
router.route("/detetePost/:id").delete(verifyJwtToken,deletePost);
router.route("/isLikedPost/:id").post(verifyJwtToken,isLiked);

router.route("/addComment/:postID").post(verifyJwtToken,addComment);
router.route("/deleteComment/:id").delete(verifyJwtToken,deleteComment);

// router.route("/feed").get(verifyJwtToken,getFeed);

export default router;