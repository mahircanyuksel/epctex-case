export interface Technology {
  name: string;
  version?: string;
  category: string;
}

export interface AnalysisResult {
  id: string;
  url: string;
  status: "analyzing" | "completed" | "failed";
  technologies?: Technology[];
  linkCount?: number;
  createdAt: string;
  completedAt?: string;
  error?: string;
}

export interface CreateAnalysisRequest {
  url: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: {
    limit?: number;
    offset?: number;
  };
}

export interface ApiError {
  error: string;
  code: string;
}

export interface UrlValidationResult {
  isValid: boolean;
  error?: string;
}
