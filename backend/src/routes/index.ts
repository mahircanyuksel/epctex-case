import { Router } from "express";
import healthRoutes from "./health.routes";
import analysisRoutes from "./analysis.routes";

const router = Router();

router.use("/api", healthRoutes);
router.use("/api", analysisRoutes);

export default router;
