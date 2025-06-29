"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.URL_REGEX = void 0;
exports.isValidUrl = isValidUrl;
exports.normalizeUrl = normalizeUrl;
exports.generateAnalysisId = generateAnalysisId;
exports.toAnalysisResponse = toAnalysisResponse;
exports.extractDomain = extractDomain;
exports.delay = delay;
exports.URL_REGEX = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
function isValidUrl(url) {
    try {
        const trimmed = url.trim();
        return exports.URL_REGEX.test(trimmed);
    }
    catch {
        return false;
    }
}
function normalizeUrl(url) {
    const trimmed = url.trim();
    if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
        return `https://${trimmed}`;
    }
    return trimmed;
}
function generateAnalysisId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
function toAnalysisResponse(result) {
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
function extractDomain(url) {
    try {
        const urlObj = new URL(url);
        return urlObj.hostname;
    }
    catch {
        return url;
    }
}
function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
//# sourceMappingURL=utils.js.map