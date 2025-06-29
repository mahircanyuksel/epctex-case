export interface Technology {
    name: string;
    version?: string;
    category: string;
}
export interface AnalysisResult {
    id: string;
    url: string;
    status: "analyzing" | "completed" | "failed";
    technologies: Technology[];
    linkCount: number;
    createdAt: Date;
    completedAt?: Date;
    error?: string;
}
export interface CreateAnalysisRequest {
    url: string;
}
export interface AnalysisResponse {
    id: string;
    url: string;
    status: "analyzing" | "completed" | "failed";
    technologies?: Technology[];
    linkCount?: number;
    createdAt: string;
    completedAt?: string;
    error?: string;
}
export interface BuiltWithResponse {
    Results?: Array<{
        Result: {
            IsDB: boolean;
            Spend: number;
            Paths: Array<{
                Domain: string;
                Url: string;
                SubDomain: string;
                Technologies: Array<{
                    Name: string;
                    Description: string;
                    Link: string;
                    Tag: string;
                    FirstDetected: number;
                    LastDetected: number;
                    IsPremium: string;
                }>;
            }>;
        };
    }>;
    Errors?: Array<{
        Message: string;
    }>;
}
//# sourceMappingURL=types.d.ts.map