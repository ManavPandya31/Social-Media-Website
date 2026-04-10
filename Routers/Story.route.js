import express from "express";
import { upload } from "../Middlewares/Multer.middleware.js";
import { verifyJwtToken } from "../Middlewares/Auth.middleware.js";
import { createUserStory , getUsersStory , deleteUserStory} from "../Controllers/Story.controller.js";

const router = express.Router();

router.route("/createUserStory").post(verifyJwtToken, upload.single("media"),createUserStory);
router.route("/getUsersStory").get(verifyJwtToken,getUsersStory);
router.route("/deleteUserStory/:storyId").delete(verifyJwtToken,deleteUserStory);

export default router;