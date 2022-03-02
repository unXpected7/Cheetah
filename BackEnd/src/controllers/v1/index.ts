import { Router } from "express";
const router: Router = Router();

import usersController from "./usersController";

router.use("/", usersController);

export default router;
