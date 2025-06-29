import { AnalysisResult } from "../types";
export declare class AnalysisService {
    private builtWithService;
    constructor();
    startAnalysis(url: string): Promise<string>;
    getAnalysis(id: string): AnalysisResult | undefined;
    getAllAnalyses(limit?: number, offset?: number): AnalysisResult[];
    private performAnalysis;
    private countWebsiteLinks;
}
export default AnalysisService;
//# sourceMappingURL=analysis.service.d.ts.map