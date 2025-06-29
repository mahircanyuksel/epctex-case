import { AnalysisResult } from "./types";

class AnalysisStorage {
  private analyses: Map<string, AnalysisResult> = new Map();

  save(analysis: AnalysisResult): void {
    this.analyses.set(analysis.id, analysis);
  }

  findById(id: string): AnalysisResult | undefined {
    return this.analyses.get(id);
  }

  findAll(limit?: number, offset?: number): AnalysisResult[] {
    const allAnalyses = Array.from(this.analyses.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );

    if (limit !== undefined) {
      const start = offset || 0;
      return allAnalyses.slice(start, start + limit);
    }

    return allAnalyses;
  }

  update(
    id: string,
    updates: Partial<AnalysisResult>
  ): AnalysisResult | undefined {
    const existing = this.analyses.get(id);
    if (!existing) {
      return undefined;
    }

    const updated = { ...existing, ...updates };
    this.analyses.set(id, updated);
    return updated;
  }

  delete(id: string): boolean {
    return this.analyses.delete(id);
  }

  findByStatus(status: AnalysisResult["status"]): AnalysisResult[] {
    return Array.from(this.analyses.values())
      .filter((analysis) => analysis.status === status)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  count(): number {
    return this.analyses.size;
  }

  clear(): void {
    this.analyses.clear();
  }

  exists(id: string): boolean {
    return this.analyses.has(id);
  }
}

export const analysisStorage = new AnalysisStorage();
export default analysisStorage;
