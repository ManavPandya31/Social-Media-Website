import { Router } from "express";
import { verifyJwtToken } from "../Middlewares/Auth.middleware.js";
import { authorizeRoles } from "../Middlewares/role.middleware.js";
import { getAllUsers , deletePost , banUser} from "../Controllers/Admin.controller.js";

const router = Router();
router.use(verifyJwtToken, authorizeRoles("admin"));

router.route("/getAllUsers").get(getAllUsers);
router.route("/deleteAnyPost/:postId").delete(deletePost);
router.route("/banUsers/:userId").put(banUser);

export default router;