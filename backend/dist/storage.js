"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analysisStorage = void 0;
class AnalysisStorage {
    constructor() {
        this.analyses = new Map();
    }
    save(analysis) {
        this.analyses.set(analysis.id, analysis);
    }
    findById(id) {
        return this.analyses.get(id);
    }
    findAll(limit, offset) {
        const allAnalyses = Array.from(this.analyses.values()).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        if (limit !== undefined) {
            const start = offset || 0;
            return allAnalyses.slice(start, start + limit);
        }
        return allAnalyses;
    }
    update(id, updates) {
        const existing = this.analyses.get(id);
        if (!existing) {
            return undefined;
        }
        const updated = { ...existing, ...updates };
        this.analyses.set(id, updated);
        return updated;
    }
    delete(id) {
        return this.analyses.delete(id);
    }
    clear() {
        this.analyses.clear();
    }
    exists(id) {
        return this.analyses.has(id);
    }
}
exports.analysisStorage = new AnalysisStorage();
exports.default = exports.analysisStorage;
//# sourceMappingURL=storage.js.map