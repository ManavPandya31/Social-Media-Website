import { Router } from "express";
import { verifyJwtToken } from "../Middlewares/Auth.middleware.js";
import { upload } from "../Middlewares/Multer.middleware.js";
import { registerUser , loginUser , createProfile} from "../Controllers/User.controller.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

router.route("/createProfile").post(upload.single("avtar"),verifyJwtToken,createProfile);

export default router;