"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalysisController = void 0;
const utils_1 = require("../utils");
const analysis_service_1 = __importDefault(require("../services/analysis.service"));
class AnalysisController {
    constructor() {
        this.startAnalysis = async (req, res) => {
            try {
                const { url } = req.body;
                if (!url) {
                    return res.status(400).json({
                        error: "URL is required",
                        code: "MISSING_URL",
                    });
                }
                if (typeof url !== "string") {
                    return res.status(400).json({
                        error: "URL must be a string",
                        code: "INVALID_URL_TYPE",
                    });
                }
                if (!(0, utils_1.isValidUrl)(url)) {
                    return res.status(400).json({
                        error: "Invalid URL format. Please provide a valid HTTP/HTTPS URL.",
                        code: "INVALID_URL_FORMAT",
                    });
                }
                const analysisId = await this.analysisService.startAnalysis(url);
                const analysis = this.analysisService.getAnalysis(analysisId);
                if (!analysis) {
                    return res.status(500).json({
                        error: "Failed to create analysis",
                        code: "ANALYSIS_CREATION_FAILED",
                    });
                }
                res.status(201).json({
                    success: true,
                    data: (0, utils_1.toAnalysisResponse)(analysis),
                });
            }
            catch (error) {
                console.error("Error starting analysis:", error);
                res.status(500).json({
                    error: "Internal server error",
                    code: "INTERNAL_ERROR",
                });
            }
        };
        this.getAnalysisById = (req, res) => {
            try {
                const { id } = req.params;
                if (!id) {
                    return res.status(400).json({
                        error: "Analysis ID is required",
                        code: "MISSING_ID",
                    });
                }
                const analysis = this.analysisService.getAnalysis(id);
                if (!analysis) {
                    return res.status(404).json({
                        error: "Analysis not found",
                        code: "ANALYSIS_NOT_FOUND",
                    });
                }
                res.json({
                    success: true,
                    data: (0, utils_1.toAnalysisResponse)(analysis),
                });
            }
            catch (error) {
                console.error("Error getting analysis:", error);
                res.status(500).json({
                    error: "Internal server error",
                    code: "INTERNAL_ERROR",
                });
            }
        };
        this.getAllAnalyses = (req, res) => {
            try {
                const limit = req.query.limit
                    ? parseInt(req.query.limit)
                    : undefined;
                const offset = req.query.offset
                    ? parseInt(req.query.offset)
                    : undefined;
                if (limit !== undefined && (isNaN(limit) || limit <= 0)) {
                    return res.status(400).json({
                        error: "Limit must be a positive integer",
                        code: "INVALID_LIMIT",
                    });
                }
                if (offset !== undefined && (isNaN(offset) || offset < 0)) {
                    return res.status(400).json({
                        error: "Offset must be a non-negative integer",
                        code: "INVALID_OFFSET",
                    });
                }
                const analyses = this.analysisService.getAllAnalyses(limit, offset);
                res.json({
                    success: true,
                    data: analyses.map(utils_1.toAnalysisResponse),
                    meta: {
                        limit,
                        offset,
                    },
                });
            }
            catch (error) {
                console.error("Error getting analyses:", error);
                res.status(500).json({
                    error: "Internal server error",
                    code: "INTERNAL_ERROR",
                });
            }
        };
        this.analysisService = new analysis_service_1.default();
    }
}
exports.AnalysisController = AnalysisController;
//# sourceMappingURL=analysis.controller.js.map