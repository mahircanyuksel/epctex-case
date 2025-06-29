import request from "supertest";
import app from "../index";
import analysisStorage from "../storage";

describe("API Endpoints", () => {
  beforeEach(() => {
    analysisStorage.clear();
  });

  describe("GET /api/health", () => {
    it("should return health status", async () => {
      const response = await request(app).get("/api/health").expect(200);

      expect(response.body).toMatchObject({
        status: "OK",
        message: "Silverlight Backend is running",
      });
      expect(response.body.timestamp).toBeDefined();
    });
  });

  describe("POST /api/analyze", () => {
    it("should start analysis for valid URL", async () => {
      const response = await request(app)
        .post("/api/analyze")
        .send({ url: "https://example.com" })
        .expect(201);

      expect(response.body).toMatchObject({
        success: true,
        data: {
          url: "https://example.com",
          status: "analyzing",
          technologies: [],
          linkCount: 0,
        },
      });
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.createdAt).toBeDefined();
    });

    it("should normalize URL without protocol", async () => {
      const response = await request(app)
        .post("/api/analyze")
        .send({ url: "example.com" })
        .expect(201);

      expect(response.body.data.url).toBe("https://example.com");
    });

    it("should reject missing URL", async () => {
      const response = await request(app)
        .post("/api/analyze")
        .send({})
        .expect(400);

      expect(response.body).toMatchObject({
        error: "URL is required",
        code: "MISSING_URL",
      });
    });

    it("should reject invalid URL format", async () => {
      const response = await request(app)
        .post("/api/analyze")
        .send({ url: "not-a-url" })
        .expect(400);

      expect(response.body).toMatchObject({
        error: "Invalid URL format. Please provide a valid HTTP/HTTPS URL.",
        code: "INVALID_URL_FORMAT",
      });
    });

    it("should reject non-string URL", async () => {
      const response = await request(app)
        .post("/api/analyze")
        .send({ url: 123 })
        .expect(400);

      expect(response.body).toMatchObject({
        error: "URL must be a string",
        code: "INVALID_URL_TYPE",
      });
    });
  });

  describe("GET /api/analysis/:id", () => {
    it("should return analysis by ID", async () => {
      // First create an analysis
      const createResponse = await request(app)
        .post("/api/analyze")
        .send({ url: "https://example.com" });

      const analysisId = createResponse.body.data.id;

      // Then retrieve it
      const response = await request(app)
        .get(`/api/analysis/${analysisId}`)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: {
          id: analysisId,
          url: "https://example.com",
          status: "analyzing",
        },
      });
    });

    it("should return 404 for non-existent analysis", async () => {
      const response = await request(app)
        .get("/api/analysis/non-existent-id")
        .expect(404);

      expect(response.body).toMatchObject({
        error: "Analysis not found",
        code: "ANALYSIS_NOT_FOUND",
      });
    });
  });

  describe("GET /api/analyses", () => {
    it("should return empty list when no analyses", async () => {
      const response = await request(app).get("/api/analyses").expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: [],
        meta: {
          total: 0,
          stats: {
            total: 0,
            completed: 0,
            analyzing: 0,
            failed: 0,
          },
        },
      });
    });

    it("should return list of analyses", async () => {
      // Create multiple analyses
      await request(app)
        .post("/api/analyze")
        .send({ url: "https://example1.com" });

      await request(app)
        .post("/api/analyze")
        .send({ url: "https://example2.com" });

      const response = await request(app).get("/api/analyses").expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.meta.total).toBe(2);
      expect(response.body.meta.stats.total).toBe(2);
      expect(response.body.meta.stats.analyzing).toBe(2);
    });

    it("should support pagination", async () => {
      // Create multiple analyses
      for (let i = 1; i <= 5; i++) {
        await request(app)
          .post("/api/analyze")
          .send({ url: `https://example${i}.com` });
      }

      const response = await request(app)
        .get("/api/analyses?limit=3&offset=1")
        .expect(200);

      expect(response.body.data).toHaveLength(3);
      expect(response.body.meta.limit).toBe(3);
      expect(response.body.meta.offset).toBe(1);
      expect(response.body.meta.total).toBe(5);
    });

    it("should validate pagination parameters", async () => {
      const response = await request(app)
        .get("/api/analyses?limit=-1")
        .expect(400);

      expect(response.body).toMatchObject({
        error: "Limit must be a positive integer",
        code: "INVALID_LIMIT",
      });
    });
  });

});
