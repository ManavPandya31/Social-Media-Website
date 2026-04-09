import { Router } from "express";
// import { verifyJwtToken } from "../Middlewares/Auth.middleware.js";
import { registerUser , loginUser } from "../Controllers/User.controller.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

// router.route("/followAndUnfollow/:userId").post(verifyJwtToken,followAndUnfollow);

export default router;