import { Request, Response } from "express";
export declare class AnalysisController {
    private analysisService;
    constructor();
    startAnalysis: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    getAnalysisById: (req: Request, res: Response) => Response<any, Record<string, any>> | undefined;
    getAllAnalyses: (req: Request, res: Response) => Response<any, Record<string, any>> | undefined;
}
//# sourceMappingURL=analysis.controller.d.ts.map