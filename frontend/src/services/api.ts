import axios from "axios";
import { AnalysisResult, CreateAnalysisRequest, ApiResponse } from "../types";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    console.log(
      `🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`
    );
    return config;
  },
  (error) => {
    console.error("❌ API Request Error:", error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error(
      "❌ API Response Error:",
      error.response?.data || error.message
    );
    return Promise.reject(error);
  }
);

export class ApiService {
  static async healthCheck(): Promise<{
    status: string;
    message: string;
    timestamp: string;
  }> {
    const response = await apiClient.get("/health");
    return response.data;
  }

  static async startAnalysis(
    request: CreateAnalysisRequest
  ): Promise<AnalysisResult> {
    const response = await apiClient.post<ApiResponse<AnalysisResult>>(
      "/analyze",
      request
    );
    return response.data.data;
  }

  static async getAnalysis(id: string): Promise<AnalysisResult> {
    const response = await apiClient.get<ApiResponse<AnalysisResult>>(
      `/analysis/${id}`
    );
    return response.data.data;
  }

  static async getAnalyses(
    limit?: number,
    offset?: number
  ): Promise<{
    analyses: AnalysisResult[];
    meta: {
      limit?: number;
      offset?: number;
    };
  }> {
    const params = new URLSearchParams();
    if (limit !== undefined) params.append("limit", limit.toString());
    if (offset !== undefined) params.append("offset", offset.toString());

    const url = `/analyses${params.toString() ? `?${params.toString()}` : ""}`;
    const response = await apiClient.get<ApiResponse<AnalysisResult[]>>(url);

    return {
      analyses: response.data.data,
      meta: response.data.meta!,
    };
  }
}

export default ApiService;
