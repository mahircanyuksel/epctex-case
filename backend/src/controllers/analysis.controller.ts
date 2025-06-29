import { Request, Response } from "express";
import { CreateAnalysisRequest } from "../types";
import { isValidUrl, toAnalysisResponse } from "../utils";
import AnalysisService from "../services/analysis.service";

export class AnalysisController {
  private analysisService: AnalysisService;

  constructor() {
    this.analysisService = new AnalysisService();
  }

  public startAnalysis = async (req: Request, res: Response) => {
    try {
      const { url }: CreateAnalysisRequest = req.body;

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

      // Normalize URL first, then validate
      const normalizedUrl = url.trim();
      const urlToValidate =
        normalizedUrl.startsWith("http://") ||
        normalizedUrl.startsWith("https://")
          ? normalizedUrl
          : `https://${normalizedUrl}`;

      if (!isValidUrl(urlToValidate)) {
        return res.status(400).json({
          error: "Invalid URL format. Please provide a valid HTTP/HTTPS URL.",
          code: "INVALID_URL_FORMAT",
        });
      }

      const analysisId = await this.analysisService.startAnalysis(
        urlToValidate
      );
      const analysis = this.analysisService.getAnalysis(analysisId);

      if (!analysis) {
        return res.status(500).json({
          error: "Failed to create analysis",
          code: "ANALYSIS_CREATION_FAILED",
        });
      }

      res.status(201).json({
        success: true,
        data: toAnalysisResponse(analysis),
      });
    } catch (error) {
      console.error("Error starting analysis:", error);
      res.status(500).json({
        error: "Internal server error",
        code: "INTERNAL_ERROR",
      });
    }
  };

  public getAnalysisById = (req: Request, res: Response) => {
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
        data: toAnalysisResponse(analysis),
      });
    } catch (error) {
      console.error("Error getting analysis:", error);
      res.status(500).json({
        error: "Internal server error",
        code: "INTERNAL_ERROR",
      });
    }
  };

  public getAllAnalyses = (req: Request, res: Response) => {
    try {
      const limit = req.query.limit
        ? parseInt(req.query.limit as string)
        : undefined;
      const offset = req.query.offset
        ? parseInt(req.query.offset as string)
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
      const totalCount = this.analysisService.getTotalCount();
      const stats = this.analysisService.getStats();

      res.json({
        success: true,
        data: analyses.map(toAnalysisResponse),
        meta: {
          total: totalCount,
          limit,
          offset,
          stats,
        },
      });
    } catch (error) {
      console.error("Error getting analyses:", error);
      res.status(500).json({
        error: "Internal server error",
        code: "INTERNAL_ERROR",
      });
    }
  };
}
