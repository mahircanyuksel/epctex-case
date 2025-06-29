import { BuiltWithResponse, Technology } from "../types";

export class BuiltWithService {
  private readonly apiKey: string;
  private readonly baseUrl = "https://api.builtwith.com/free1/api.json";

  constructor() {
    this.apiKey = process.env.BUILTWITH_API_KEY || "";

    if (!this.apiKey) {
      console.warn(
        "⚠️  BuiltWith API key not provided. Using mock data for development."
      );
    }
  }

  async analyzeTechnologies(url: string): Promise<Technology[]> {
    try {
      if (!this.apiKey) {
        return this.getMockTechnologies(url);
      }

      const response = await fetch(
        `${this.baseUrl}?KEY=${this.apiKey}&LOOKUP=${encodeURIComponent(url)}`
      );

      if (!response.ok) {
        throw new Error(
          `BuiltWith API error: ${response.status} ${response.statusText}`
        );
      }

      const data = (await response.json()) as BuiltWithResponse;

      if (data.Errors && data.Errors.length > 0) {
        throw new Error(`BuiltWith API error: ${data.Errors[0].Message}`);
      }

      return this.parseTechnologies(data);
    } catch (error) {
      console.error("Error analyzing technologies:", error);
      throw new Error(
        `Failed to analyze website technologies: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  private parseTechnologies(data: BuiltWithResponse): Technology[] {
    const technologies: Technology[] = [];

    if (!data.Results || data.Results.length === 0) {
      return technologies;
    }

    data.Results.forEach((result) => {
      result.Result.Paths.forEach((path) => {
        path.Technologies.forEach((tech) => {
          const existingTech = technologies.find((t) => t.name === tech.Name);
          if (!existingTech) {
            technologies.push({
              name: tech.Name,
              version: undefined,
              category: tech.Tag || "Other",
            });
          }
        });
      });
    });

    return technologies;
  }

  private getMockTechnologies(url: string): Technology[] {
    const commonTech = [
      { name: "React", category: "JavaScript Frameworks" },
      { name: "WordPress", category: "CMS" },
      { name: "Google Analytics", category: "Analytics" },
      { name: "jQuery", category: "JavaScript Libraries" },
      { name: "Bootstrap", category: "UI Frameworks" },
      { name: "Node.js", category: "Web Servers" },
      { name: "Nginx", category: "Web Servers" },
      { name: "Cloudflare", category: "CDN" },
      { name: "Google Fonts", category: "Font Scripts" },
      { name: "SSL Certificate", category: "SSL Certificates" },
    ];

    const numTech = Math.floor(Math.random() * 6) + 3;
    const shuffled = [...commonTech].sort(() => 0.5 - Math.random());

    return shuffled.slice(0, numTech).map((tech) => ({
      ...tech,
      version:
        Math.random() > 0.7
          ? `${Math.floor(Math.random() * 5) + 1}.${Math.floor(
              Math.random() * 10
            )}`
          : undefined,
    }));
  }

  isConfigured(): boolean {
    return Boolean(this.apiKey);
  }
}

export default BuiltWithService;
