import { Router } from "express";
import { verifyJwtToken } from "../Middlewares/Auth.middleware.js";
import { getProfile } from "../Controllers/User.controller.js";

const router = Router();

router.route("/getProfile").get(verifyJwtToken,getProfile);

export default router;