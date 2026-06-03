import { Router, type IRouter } from "express";
import healthRouter from "./health";
import adminRouter from "./admin";
import paintingsRouter from "./paintings";
import seriesRouter from "./series";
import storageRouter from "./storage";
import settingsRouter from "./settings";

const router: IRouter = Router();

router.use(healthRouter);
router.use(adminRouter);
router.use(paintingsRouter);
router.use(seriesRouter);
router.use(storageRouter);
router.use(settingsRouter);

export default router;
