import { UrlValidationResult } from "../types";

export const URL_REGEX =
  /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;

export function validateUrl(url: string): UrlValidationResult {
  if (!url || typeof url !== "string") {
    return { isValid: false, error: "URL is required" };
  }

  const trimmed = url.trim();

  if (!trimmed) {
    return { isValid: false, error: "URL cannot be empty" };
  }

  const normalizedUrl = normalizeUrl(trimmed);

  if (!URL_REGEX.test(normalizedUrl)) {
    return { isValid: false, error: "Please enter a valid HTTP/HTTPS URL" };
  }

  return { isValid: true };
}

export function normalizeUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
    return `https://${trimmed}`;
  }
  return trimmed;
}

export function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return url;
  }
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString;
    }
    return date.toLocaleString();
  } catch {
    return dateString;
  }
}

export function formatRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Unknown";
    }

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSeconds < 60) {
      return "Just now";
    } else if (diffMinutes < 60) {
      return `${diffMinutes} minute${diffMinutes !== 1 ? "s" : ""} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
    } else {
      return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
    }
  } catch {
    return "Unknown";
  }
}

export function capitalizeWords(str: string): string {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
}
