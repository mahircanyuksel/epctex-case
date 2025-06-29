import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { AnalysisResult, Technology } from "../types";
import {
  extractDomain,
  formatDate,
  capitalizeWords,
} from "../utils/validation";
import ApiService from "../services/api";

const AnalysisDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      navigate("/");
      return;
    }

    loadAnalysis();

    const interval = setInterval(() => {
      if (analysis?.status === "analyzing") {
        loadAnalysis();
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [id, analysis?.status]);

  const loadAnalysis = async () => {
    if (!id) return;

    try {
      const fetchedAnalysis = await ApiService.getAnalysis(id);
      setAnalysis(fetchedAnalysis);
      setError("");
    } catch (err: any) {
      console.error("Failed to load analysis:", err);
      if (err.response?.status === 404) {
        setError("Analysis not found.");
      } else {
        setError("Failed to load analysis details. Please try again.");
      }
    } finally {
      setLoading(false);
    }
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

  const groupTechnologiesByCategory = (technologies: Technology[]) => {
    const grouped: { [category: string]: Technology[] } = {};

    technologies.forEach((tech) => {
      const category = tech.category || "Other";
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(tech);
    });

    return grouped;
  };

  if (loading) {
    return (
      <div className="page">
        <div className="container">
          <div className="loading">
            <span className="spinner"></span>
            Loading analysis details...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <div className="container">
          <div className="error">{error}</div>
          <Link to="/" className="btn btn-secondary">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="page">
        <div className="container">
          <div className="error">Analysis not found.</div>
          <Link to="/" className="btn btn-secondary">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const groupedTechnologies = analysis.technologies
    ? groupTechnologiesByCategory(analysis.technologies)
    : {};

  return (
    <div className="page">
      <div className="container">
        <header className="header">
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <Link to="/" className="btn btn-secondary">
              ← Back to Dashboard
            </Link>
            <div>
              <h1>Analysis Details</h1>
              <p className="subtitle">{extractDomain(analysis.url)}</p>
            </div>
          </div>
        </header>

        <div className="card" style={{ marginBottom: "2rem" }}>
          <div className="card-header">
            <h2>Analysis Overview</h2>
          </div>
          <div className="card-content">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "1.5rem",
              }}
            >
              <div>
                <strong>Website URL:</strong>
                <div style={{ marginTop: "0.5rem" }}>
                  <a
                    href={analysis.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#3b82f6" }}
                  >
                    {analysis.url}
                  </a>
                </div>
              </div>

              <div>
                <strong>Status:</strong>
                <div style={{ marginTop: "0.5rem" }}>
                  {renderStatusBadge(analysis.status)}
                </div>
              </div>

              <div>
                <strong>Started:</strong>
                <div style={{ marginTop: "0.5rem" }}>
                  {formatDate(analysis.createdAt)}
                </div>
              </div>

              {analysis.completedAt && (
                <div>
                  <strong>Completed:</strong>
                  <div style={{ marginTop: "0.5rem" }}>
                    {formatDate(analysis.completedAt)}
                  </div>
                </div>
              )}

              {analysis.linkCount !== undefined && (
                <div>
                  <strong>Total Links:</strong>
                  <div
                    style={{
                      marginTop: "0.5rem",
                      fontSize: "1.5rem",
                      fontWeight: "bold",
                      color: "#3b82f6",
                    }}
                  >
                    {analysis.linkCount}
                  </div>
                </div>
              )}
            </div>

            {analysis.error && (
              <div className="error" style={{ marginTop: "1rem" }}>
                <strong>Error:</strong> {analysis.error}
              </div>
            )}
          </div>
        </div>

        {analysis.status === "analyzing" ? (
          <div className="card">
            <div className="card-header">
              <h2>Technologies</h2>
            </div>
            <div className="card-content">
              <div className="loading">
                <span className="spinner"></span>
                Analyzing website technologies...
              </div>
            </div>
          </div>
        ) : analysis.status === "completed" &&
          analysis.technologies &&
          analysis.technologies.length > 0 ? (
          <div className="card">
            <div className="card-header">
              <h2>Detected Technologies</h2>
              <p className="subtitle">
                Found {analysis.technologies.length} technology
                {analysis.technologies.length !== 1 ? "ies" : ""}
              </p>
            </div>
            <div className="card-content">
              {Object.entries(groupedTechnologies).map(
                ([category, technologies]) => (
                  <div key={category} style={{ marginBottom: "2rem" }}>
                    <h3 style={{ marginBottom: "1rem", color: "#374151" }}>
                      {capitalizeWords(category)} ({technologies.length})
                    </h3>
                    <div className="tech-list">
                      {technologies.map((tech, index) => (
                        <div
                          key={`${tech.name}-${index}`}
                          className="tech-item"
                        >
                          <div className="tech-name">{tech.name}</div>
                          <div className="tech-category">{tech.category}</div>
                          {tech.version && (
                            <div className="tech-version">v{tech.version}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        ) : analysis.status === "completed" ? (
          <div className="card">
            <div className="card-header">
              <h2>Technologies</h2>
            </div>
            <div className="card-content">
              <div className="empty-state">
                <h3>No Technologies Detected</h3>
                <p>
                  The analysis completed but no technologies were detected on
                  this website.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="card">
            <div className="card-header">
              <h2>Technologies</h2>
            </div>
            <div className="card-content">
              <div className="empty-state">
                <h3>Analysis Failed</h3>
                <p>Unable to analyze technologies due to an error.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisDetail;
