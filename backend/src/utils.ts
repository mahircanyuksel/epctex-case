import { AnalysisResult, AnalysisResponse } from "./types";

export const URL_REGEX =
  /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;

export function isValidUrl(url: string): boolean {
  try {
    const trimmed = url.trim();
    return URL_REGEX.test(trimmed);
  } catch {
    return false;
  }
}

export function normalizeUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
    return `https://${trimmed}`;
  }
  return trimmed;
}

export function generateAnalysisId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function toAnalysisResponse(result: AnalysisResult): AnalysisResponse {
  return {
    id: result.id,
    url: result.url,
    status: result.status,
    technologies: result.technologies,
    linkCount: result.linkCount,
    createdAt: result.createdAt.toISOString(),
    completedAt: result.completedAt?.toISOString(),
    error: result.error,
  };
}

export function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return url;
  }
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
