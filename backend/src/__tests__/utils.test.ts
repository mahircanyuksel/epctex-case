import {
  isValidUrl,
  normalizeUrl,
  generateAnalysisId,
  extractDomain,
  toAnalysisResponse,
} from "../utils";
import { AnalysisResult } from "../types";

describe("Utils", () => {
  describe("isValidUrl", () => {
    it("should validate correct URLs", () => {
      expect(isValidUrl("https://example.com")).toBe(true);
      expect(isValidUrl("http://example.com")).toBe(true);
      expect(isValidUrl("https://www.example.com")).toBe(true);
      expect(isValidUrl("https://example.com/path?query=1")).toBe(true);
      expect(isValidUrl("https://subdomain.example.com")).toBe(true);
    });

    it("should reject invalid URLs", () => {
      expect(isValidUrl("not-a-url")).toBe(false);
      expect(isValidUrl("ftp://example.com")).toBe(false);
      expect(isValidUrl("example.com")).toBe(false);
      expect(isValidUrl("")).toBe(false);
      expect(isValidUrl("javascript:alert(1)")).toBe(false);
    });

    it("should handle edge cases", () => {
      expect(isValidUrl("  https://example.com  ")).toBe(true);
      expect(isValidUrl("https://")).toBe(false);
      expect(isValidUrl("https://.")).toBe(false);
    });
  });

  describe("normalizeUrl", () => {
    it("should add https protocol when missing", () => {
      expect(normalizeUrl("example.com")).toBe("https://example.com");
      expect(normalizeUrl("www.example.com")).toBe("https://www.example.com");
    });

    it("should preserve existing protocol", () => {
      expect(normalizeUrl("https://example.com")).toBe("https://example.com");
      expect(normalizeUrl("http://example.com")).toBe("http://example.com");
    });

    it("should trim whitespace", () => {
      expect(normalizeUrl("  example.com  ")).toBe("https://example.com");
      expect(normalizeUrl("  https://example.com  ")).toBe(
        "https://example.com"
      );
    });
  });

  describe("generateAnalysisId", () => {
    it("should generate unique IDs", () => {
      const id1 = generateAnalysisId();
      const id2 = generateAnalysisId();

      expect(id1).not.toBe(id2);
      expect(typeof id1).toBe("string");
      expect(id1.length).toBeGreaterThan(0);
    });

    it("should generate multiple unique IDs", () => {
      const ids = Array.from({ length: 100 }, () => generateAnalysisId());
      const uniqueIds = new Set(ids);

      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  describe("extractDomain", () => {
    it("should extract domain from valid URLs", () => {
      expect(extractDomain("https://example.com")).toBe("example.com");
      expect(extractDomain("https://www.example.com")).toBe("www.example.com");
      expect(extractDomain("https://subdomain.example.com/path")).toBe(
        "subdomain.example.com"
      );
      expect(extractDomain("http://example.com:8080")).toBe("example.com");
    });

    it("should return original string for invalid URLs", () => {
      expect(extractDomain("not-a-url")).toBe("not-a-url");
      expect(extractDomain("example.com")).toBe("example.com");
    });
  });

  describe("toAnalysisResponse", () => {
    it("should convert AnalysisResult to AnalysisResponse", () => {
      const analysisResult: AnalysisResult = {
        id: "test-id",
        url: "https://example.com",
        status: "completed",
        technologies: [
          {
            name: "React",
            category: "JavaScript Frameworks",
            version: "18.0.0",
          },
        ],
        linkCount: 42,
        createdAt: new Date("2023-01-01T00:00:00.000Z"),
        completedAt: new Date("2023-01-01T00:01:00.000Z"),
      };

      const response = toAnalysisResponse(analysisResult);

      expect(response).toEqual({
        id: "test-id",
        url: "https://example.com",
        status: "completed",
        technologies: [
          {
            name: "React",
            category: "JavaScript Frameworks",
            version: "18.0.0",
          },
        ],
        linkCount: 42,
        createdAt: "2023-01-01T00:00:00.000Z",
        completedAt: "2023-01-01T00:01:00.000Z",
        error: undefined,
      });
    });

    it("should handle analysis without completedAt", () => {
      const analysisResult: AnalysisResult = {
        id: "test-id",
        url: "https://example.com",
        status: "analyzing",
        technologies: [],
        linkCount: 0,
        createdAt: new Date("2023-01-01T00:00:00.000Z"),
      };

      const response = toAnalysisResponse(analysisResult);

      expect(response.completedAt).toBeUndefined();
      expect(response.status).toBe("analyzing");
    });
  });
});
