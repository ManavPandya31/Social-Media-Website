import { Router } from "express";
import { verifyJwtToken } from "../Middlewares/Auth.middleware.js";
import { addComment , deleteComment , updateComment , getComments} from "../Controllers/Comment.controller.js";

const router = Router();

router.route("/AddComment/:postId").post(verifyJwtToken,addComment);
router.route("/updateComment/:commentId").put(verifyJwtToken,updateComment);
router.route("/deleteComment/:commentId").delete(verifyJwtToken,deleteComment);
router.route("/getCommemts/:postId").get(verifyJwtToken,getComments);

export default router;