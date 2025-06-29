"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalysisService = void 0;
const cheerio = __importStar(require("cheerio"));
const utils_1 = require("../utils");
const storage_1 = __importDefault(require("../storage"));
const builtwith_service_1 = __importDefault(require("./builtwith.service"));
class AnalysisService {
    constructor() {
        this.builtWithService = new builtwith_service_1.default();
    }
    async startAnalysis(url) {
        const normalizedUrl = (0, utils_1.normalizeUrl)(url);
        const analysisId = (0, utils_1.generateAnalysisId)();
        const analysis = {
            id: analysisId,
            url: normalizedUrl,
            status: "analyzing",
            technologies: [],
            linkCount: 0,
            createdAt: new Date(),
        };
        storage_1.default.save(analysis);
        this.performAnalysis(analysisId).catch((error) => {
            console.error(`Analysis ${analysisId} failed:`, error);
            storage_1.default.update(analysisId, {
                status: "failed",
                error: error.message,
                completedAt: new Date(),
            });
        });
        return analysisId;
    }
    getAnalysis(id) {
        return storage_1.default.findById(id);
    }
    getAllAnalyses(limit, offset) {
        return storage_1.default.findAll(limit, offset);
    }
    async performAnalysis(analysisId) {
        const analysis = storage_1.default.findById(analysisId);
        if (!analysis) {
            throw new Error(`Analysis ${analysisId} not found`);
        }
        try {
            await (0, utils_1.delay)(1000);
            const technologies = await this.builtWithService.analyzeTechnologies(analysis.url);
            const linkCount = await this.countWebsiteLinks(analysis.url);
            storage_1.default.update(analysisId, {
                status: "completed",
                technologies,
                linkCount,
                completedAt: new Date(),
            });
        }
        catch (error) {
            console.error(`Error in analysis ${analysisId}:`, error);
            throw error;
        }
    }
    async countWebsiteLinks(url) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);
            const response = await fetch(url);
            clearTimeout(timeoutId);
            if (!response.ok) {
                console.warn(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
                return 0;
            }
            const html = await response.text();
            const $ = cheerio.load(html);
            const links = $("a[href]").length;
            return links;
        }
        catch (error) {
            console.warn(`Error counting links for ${url}:`, error);
            return 0;
        }
    }
}
exports.AnalysisService = AnalysisService;
exports.default = AnalysisService;
//# sourceMappingURL=analysis.service.js.map