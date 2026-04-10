import { Router } from "express";
import { verifyJwtToken } from "../Middlewares/Auth.middleware.js";
import { upload } from "../Middlewares/Multer.middleware.js";
import { registerUser , loginUser , createProfile , updateUserProfile , getUserProfile
} from "../Controllers/User.controller.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

router.route("/createProfile").post(upload.single("avtar"),verifyJwtToken,createProfile);
router.route("/updateUserProfile/:id").put(upload.single("avtar"),verifyJwtToken,updateUserProfile);
router.route("/getUserProfile/:id").get(verifyJwtToken,getUserProfile);

export default router;