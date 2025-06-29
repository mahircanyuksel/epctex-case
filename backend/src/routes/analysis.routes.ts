import { Router } from "express";
import { AnalysisController } from "../controllers/analysis.controller";

const router = Router();
const analysisController = new AnalysisController();

router.post("/analyze", analysisController.startAnalysis);

router.get("/analysis/:id", analysisController.getAnalysisById);

router.get("/analyses", analysisController.getAllAnalyses);

export default router;
