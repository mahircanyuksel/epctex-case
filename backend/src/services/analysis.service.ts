import * as cheerio from "cheerio";
import { AnalysisResult, Technology } from "../types";
import { generateAnalysisId, normalizeUrl, delay } from "../utils";
import analysisStorage from "../storage";
import BuiltWithService from "./builtwith.service";

export class AnalysisService {
  private builtWithService: BuiltWithService;

  constructor() {
    this.builtWithService = new BuiltWithService();
  }

  async startAnalysis(url: string): Promise<string> {
    const normalizedUrl = normalizeUrl(url);
    const analysisId = generateAnalysisId();

    const analysis: AnalysisResult = {
      id: analysisId,
      url: normalizedUrl,
      status: "analyzing",
      technologies: [],
      linkCount: 0,
      createdAt: new Date(),
    };

    analysisStorage.save(analysis);
    this.performAnalysis(analysisId).catch((error) => {
      console.error(`Analysis ${analysisId} failed:`, error);
      analysisStorage.update(analysisId, {
        status: "failed",
        error: error.message,
        completedAt: new Date(),
      });
    });

    return analysisId;
  }

  getAnalysis(id: string): AnalysisResult | undefined {
    return analysisStorage.findById(id);
  }

  getAllAnalyses(limit?: number, offset?: number): AnalysisResult[] {
    return analysisStorage.findAll(limit, offset);
  }

  getTotalCount(): number {
    return analysisStorage.count();
  }

  getStats(): {
    total: number;
    completed: number;
    analyzing: number;
    failed: number;
  } {
    const allAnalyses = analysisStorage.findAll();
    const stats = {
      total: allAnalyses.length,
      completed: allAnalyses.filter((a) => a.status === "completed").length,
      analyzing: allAnalyses.filter((a) => a.status === "analyzing").length,
      failed: allAnalyses.filter((a) => a.status === "failed").length,
    };
    return stats;
  }

  private async performAnalysis(analysisId: string): Promise<void> {
    const analysis = analysisStorage.findById(analysisId);
    if (!analysis) {
      throw new Error(`Analysis ${analysisId} not found`);
    }

    try {
      await delay(1000);
      const technologies = await this.builtWithService.analyzeTechnologies(
        analysis.url
      );

      const linkCount = await this.countWebsiteLinks(analysis.url);

      analysisStorage.update(analysisId, {
        status: "completed",
        technologies,
        linkCount,
        completedAt: new Date(),
      });
    } catch (error) {
      console.error(`Error in analysis ${analysisId}:`, error);
      throw error;
    }
  }

  private async countWebsiteLinks(url: string): Promise<number> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(url);

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.warn(
          `Failed to fetch ${url}: ${response.status} ${response.statusText}`
        );
        return 0;
      }

      const html = await response.text();
      const $ = cheerio.load(html);

      const links = $("a[href]").length;

      return links;
    } catch (error) {
      console.warn(`Error counting links for ${url}:`, error);
      return 0;
    }
  }
}

export default AnalysisService;
