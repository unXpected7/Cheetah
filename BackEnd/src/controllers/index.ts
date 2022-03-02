import { Router } from "express";
const router: Router = Router();

import version1 from "./v1";

router.use("/", version1);

export default router;