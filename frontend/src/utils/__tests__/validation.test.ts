import {
  validateUrl,
  normalizeUrl,
  extractDomain,
  formatDate,
  formatRelativeTime,
  capitalizeWords,
  URL_REGEX,
} from "../validation";

describe("URL Validation", () => {
  describe("validateUrl", () => {
    it("validates correct HTTP URLs", () => {
      const result = validateUrl("http://example.com");
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it("validates correct HTTPS URLs", () => {
      const result = validateUrl("https://example.com");
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it("validates URLs with www prefix", () => {
      const result = validateUrl("https://www.example.com");
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it("validates URLs with paths and query parameters", () => {
      const result = validateUrl(
        "https://example.com/path?param=value&other=test"
      );
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it("validates URLs without protocol by adding https", () => {
      const result = validateUrl("example.com");
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it("rejects empty URLs", () => {
      const result = validateUrl("");
      expect(result.isValid).toBe(false);
      expect(result.error).toBe("URL is required");
    });

    it("rejects whitespace-only URLs", () => {
      const result = validateUrl("   ");
      expect(result.isValid).toBe(false);
      expect(result.error).toBe("URL cannot be empty");
    });

    it("rejects invalid URLs", () => {
      const result = validateUrl("not-a-url");
      expect(result.isValid).toBe(false);
      expect(result.error).toBe("Please enter a valid HTTP/HTTPS URL");
    });

    it("rejects null or undefined", () => {
      expect(validateUrl(null as any).isValid).toBe(false);
      expect(validateUrl(undefined as any).isValid).toBe(false);
    });
  });

  describe("normalizeUrl", () => {
    it("adds https to URLs without protocol", () => {
      expect(normalizeUrl("example.com")).toBe("https://example.com");
      expect(normalizeUrl("www.example.com")).toBe("https://www.example.com");
    });

    it("preserves existing HTTP protocol", () => {
      expect(normalizeUrl("http://example.com")).toBe("http://example.com");
    });

    it("preserves existing HTTPS protocol", () => {
      expect(normalizeUrl("https://example.com")).toBe("https://example.com");
    });

    it("handles URLs with trailing whitespace", () => {
      expect(normalizeUrl("  example.com  ")).toBe("https://example.com");
    });
  });

  describe("URL_REGEX", () => {
    it("matches valid HTTP URLs", () => {
      expect(URL_REGEX.test("http://example.com")).toBe(true);
      expect(URL_REGEX.test("https://example.com")).toBe(true);
      expect(URL_REGEX.test("https://www.example.com")).toBe(true);
    });

    it("rejects URLs without protocol", () => {
      expect(URL_REGEX.test("example.com")).toBe(false);
      expect(URL_REGEX.test("www.example.com")).toBe(false);
    });

    it("rejects invalid protocols", () => {
      expect(URL_REGEX.test("ftp://example.com")).toBe(false);
      expect(URL_REGEX.test("file://example.com")).toBe(false);
    });
  });
});

describe("Utility Functions", () => {
  describe("extractDomain", () => {
    it("extracts domain from HTTP URLs", () => {
      expect(extractDomain("http://example.com")).toBe("example.com");
      expect(extractDomain("https://www.example.com")).toBe("www.example.com");
    });

    it("extracts domain from URLs with paths", () => {
      expect(extractDomain("https://example.com/path")).toBe("example.com");
      expect(extractDomain("https://api.example.com/v1/data")).toBe(
        "api.example.com"
      );
    });

    it("returns original string for invalid URLs", () => {
      expect(extractDomain("not-a-url")).toBe("not-a-url");
      expect(extractDomain("")).toBe("");
    });
  });

  describe("formatDate", () => {
    it("formats valid date strings", () => {
      const date = "2023-01-01T12:00:00.000Z";
      const result = formatDate(date);
      expect(result).toContain("2023");
      expect(typeof result).toBe("string");
    });

    it("returns original string for invalid dates", () => {
      expect(formatDate("invalid-date")).toBe("invalid-date");
      expect(formatDate("")).toBe("");
    });
  });

  describe("formatRelativeTime", () => {
    const now = new Date("2023-01-01T12:00:00.000Z");

    beforeAll(() => {
      jest.useFakeTimers();
      jest.setSystemTime(now);
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    it('returns "Just now" for recent times', () => {
      const recent = new Date(now.getTime() - 30 * 1000).toISOString();
      expect(formatRelativeTime(recent)).toBe("Just now");
    });

    it("returns minutes for times within an hour", () => {
      const fiveMinutesAgo = new Date(
        now.getTime() - 5 * 60 * 1000
      ).toISOString();
      expect(formatRelativeTime(fiveMinutesAgo)).toBe("5 minutes ago");

      const oneMinuteAgo = new Date(
        now.getTime() - 1 * 60 * 1000
      ).toISOString();
      expect(formatRelativeTime(oneMinuteAgo)).toBe("1 minute ago");
    });

    it("returns hours for times within a day", () => {
      const twoHoursAgo = new Date(
        now.getTime() - 2 * 60 * 60 * 1000
      ).toISOString();
      expect(formatRelativeTime(twoHoursAgo)).toBe("2 hours ago");

      const oneHourAgo = new Date(
        now.getTime() - 1 * 60 * 60 * 1000
      ).toISOString();
      expect(formatRelativeTime(oneHourAgo)).toBe("1 hour ago");
    });

    it("returns days for older times", () => {
      const twoDaysAgo = new Date(
        now.getTime() - 2 * 24 * 60 * 60 * 1000
      ).toISOString();
      expect(formatRelativeTime(twoDaysAgo)).toBe("2 days ago");

      const oneDayAgo = new Date(
        now.getTime() - 1 * 24 * 60 * 60 * 1000
      ).toISOString();
      expect(formatRelativeTime(oneDayAgo)).toBe("1 day ago");
    });

    it('returns "Unknown" for invalid dates', () => {
      expect(formatRelativeTime("invalid-date")).toBe("Unknown");
      expect(formatRelativeTime("")).toBe("Unknown");
    });
  });

  describe("capitalizeWords", () => {
    it("capitalizes first letter of each word", () => {
      expect(capitalizeWords("hello world")).toBe("Hello World");
      expect(capitalizeWords("JAVASCRIPT FRAMEWORK")).toBe(
        "Javascript Framework"
      );
      expect(capitalizeWords("api management")).toBe("Api Management");
    });

    it("handles single words", () => {
      expect(capitalizeWords("javascript")).toBe("Javascript");
      expect(capitalizeWords("API")).toBe("Api");
    });

    it("handles empty strings", () => {
      expect(capitalizeWords("")).toBe("");
    });

    it("handles mixed case", () => {
      expect(capitalizeWords("javaScript framEWork")).toBe(
        "Javascript Framework"
      );
    });
  });
});
