import { Technology } from "../types";
export declare class BuiltWithService {
    private readonly apiKey;
    private readonly baseUrl;
    constructor();
    analyzeTechnologies(url: string): Promise<Technology[]>;
    private parseTechnologies;
    private getMockTechnologies;
    isConfigured(): boolean;
}
export default BuiltWithService;
//# sourceMappingURL=builtwith.service.d.ts.map