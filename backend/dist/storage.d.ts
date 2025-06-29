import { AnalysisResult } from "./types";
declare class AnalysisStorage {
    private analyses;
    save(analysis: AnalysisResult): void;
    findById(id: string): AnalysisResult | undefined;
    findAll(limit?: number, offset?: number): AnalysisResult[];
    update(id: string, updates: Partial<AnalysisResult>): AnalysisResult | undefined;
    delete(id: string): boolean;
    clear(): void;
    exists(id: string): boolean;
}
export declare const analysisStorage: AnalysisStorage;
export default analysisStorage;
//# sourceMappingURL=storage.d.ts.map