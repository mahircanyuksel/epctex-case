import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AnalysisResult } from "../types";
import {
  validateUrl,
  normalizeUrl,
  extractDomain,
  formatRelativeTime,
} from "../utils/validation";
import ApiService from "../services/api";

const ITEMS_PER_PAGE = 3;

const Dashboard: React.FC = () => {
  const [url, setUrl] = useState("");
  const [urlError, setUrlError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [analyses, setAnalyses] = useState<AnalysisResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalAnalyses, setTotalAnalyses] = useState(0);

  useEffect(() => {
    loadAnalyses();

    const interval = setInterval(loadAnalyses, 3000);

    return () => clearInterval(interval);
  }, [currentPage]);

  const loadAnalyses = async () => {
    try {
      const offset = currentPage * ITEMS_PER_PAGE;
      const { analyses: fetchedAnalyses, meta } = await ApiService.getAnalyses(
        ITEMS_PER_PAGE,
        offset
      );

      setAnalyses(fetchedAnalyses);
      setTotalAnalyses(meta.total);
      setError("");
    } catch (err) {
      console.error("Failed to load analyses:", err);
      setError("Failed to load analyses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setUrl(newUrl);

    if (urlError) {
      setUrlError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateUrl(url);
    if (!validation.isValid) {
      setUrlError(validation.error || "Invalid URL");
      return;
    }

    setIsSubmitting(true);
    setUrlError("");

    try {
      const normalizedUrl = normalizeUrl(url);
      await ApiService.startAnalysis({ url: normalizedUrl });

      setUrl("");
      await loadAnalyses();
    } catch (err: any) {
      console.error("Failed to start analysis:", err);
      const errorMessage =
        err.response?.data?.error ||
        "Failed to start analysis. Please try again.";
      setUrlError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = () => {
    const validation = validateUrl(url);
    return validation.isValid && !isSubmitting;
  };

  const renderStatusBadge = (status: AnalysisResult["status"]) => {
    const statusConfig = {
      analyzing: { text: "Analyzing", className: "status-analyzing" },
      completed: { text: "Completed", className: "status-completed" },
      failed: { text: "Failed", className: "status-failed" },
    };

    const config = statusConfig[status];
    return (
      <span className={`status-badge ${config.className}`}>
        {status === "analyzing" && <span className="spinner"></span>}
        {config.text}
      </span>
    );
  };

  const renderAnalysisActions = (analysis: AnalysisResult) => {
    if (analysis.status === "analyzing") {
      return <span className="analysis-meta">Analyzing...</span>;
    }

    if (analysis.status === "completed") {
      return (
        <Link to={`/analysis/${analysis.id}`} className="btn btn-link">
          View More
        </Link>
      );
    }

    if (analysis.status === "failed") {
      return (
        <span className="analysis-meta text-red-500">
          {analysis.error || "Analysis failed"}
        </span>
      );
    }
  };

  const totalPages = Math.ceil(totalAnalyses / ITEMS_PER_PAGE);

  return (
    <div className="page">
      <div className="container">
        <header className="header">
          <h1>Silverlight</h1>
          <p className="subtitle">Website Technology Analysis Dashboard</p>
        </header>

        <div className="card" style={{ marginBottom: "2rem" }}>
          <div className="card-header">
            <h2>Analyze Website</h2>
          </div>
          <div className="card-content">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="url" className="form-label">
                  Website URL
                </label>
                <input
                  type="text"
                  id="url"
                  value={url}
                  onChange={handleUrlChange}
                  placeholder="Enter website URL (e.g., example.com or https://example.com)"
                  className={`form-input ${urlError ? "error" : ""}`}
                  disabled={isSubmitting}
                />
                {urlError && <div className="form-error">{urlError}</div>}
              </div>
              <button
                type="submit"
                disabled={!isFormValid()}
                className="btn btn-primary"
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner"></span>
                    Starting Analysis...
                  </>
                ) : (
                  "Analyze"
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2>Analyzing Targets</h2>
            {totalAnalyses > 0 && (
              <p className="subtitle">
                Total: {totalAnalyses} website{totalAnalyses !== 1 ? "s" : ""}
              </p>
            )}
          </div>
          <div className="card-content">
            {error && <div className="error">{error}</div>}

            {loading ? (
              <div className="loading">
                <span className="spinner"></span>
                Loading analyses...
              </div>
            ) : analyses.length === 0 ? (
              <div className="empty-state">
                <h3>No Analyses Yet</h3>
                <p>
                  Start by entering a website URL above to begin your first
                  analysis.
                </p>
              </div>
            ) : (
              <>
                <div className="analysis-list">
                  {analyses.map((analysis) => (
                    <div key={analysis.id} className="analysis-item">
                      <div className="analysis-info">
                        <div className="analysis-url">
                          {extractDomain(analysis.url)}
                        </div>
                        <div className="analysis-meta">
                          Started {formatRelativeTime(analysis.createdAt)}
                          {analysis.completedAt &&
                            ` • Completed ${formatRelativeTime(
                              analysis.completedAt
                            )}`}
                          {analysis.linkCount !== undefined &&
                            analysis.status === "completed" &&
                            ` • ${analysis.linkCount} links found`}
                        </div>
                      </div>
                      <div className="analysis-actions">
                        {renderStatusBadge(analysis.status)}
                        {renderAnalysisActions(analysis)}
                      </div>
                    </div>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="pagination">
                    <button
                      onClick={() =>
                        setCurrentPage(Math.max(0, currentPage - 1))
                      }
                      disabled={currentPage === 0}
                      className="btn btn-secondary"
                    >
                      Previous
                    </button>

                    <span className="pagination-info">
                      Page {currentPage + 1} of {totalPages}
                    </span>

                    <button
                      onClick={() =>
                        setCurrentPage(
                          Math.min(totalPages - 1, currentPage + 1)
                        )
                      }
                      disabled={currentPage >= totalPages - 1}
                      className="btn btn-secondary"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
