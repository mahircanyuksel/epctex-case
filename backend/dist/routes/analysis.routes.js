"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const analysis_controller_1 = require("../controllers/analysis.controller");
const router = (0, express_1.Router)();
const analysisController = new analysis_controller_1.AnalysisController();
router.post("/analyze", analysisController.startAnalysis);
router.get("/analysis/:id", analysisController.getAnalysisById);
router.get("/analyses", analysisController.getAllAnalyses);
exports.default = router;
//# sourceMappingURL=analysis.routes.js.map