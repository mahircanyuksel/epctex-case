import { AnalysisResult, AnalysisResponse } from "./types";
export declare const URL_REGEX: RegExp;
export declare function isValidUrl(url: string): boolean;
export declare function normalizeUrl(url: string): string;
export declare function generateAnalysisId(): string;
export declare function toAnalysisResponse(result: AnalysisResult): AnalysisResponse;
export declare function extractDomain(url: string): string;
export declare function delay(ms: number): Promise<void>;
//# sourceMappingURL=utils.d.ts.map