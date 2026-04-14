import { Router } from "express";
import { verifyJwtToken  } from "../Middlewares/Auth.middleware.js";
import { userRegister , loginUser , logoutUser } from "../Controllers/User.controller.js";

const router = Router();

router.route("/register").post(userRegister);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJwtToken, logoutUser);

export default router;