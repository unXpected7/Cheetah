import { Router } from "express";
const router: Router = Router();

import usersController from "./usersController";
import chatController from "./chatController";

router.use("/", usersController);
router.use("/", chatController);

export default router;
