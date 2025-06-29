import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Dashboard from "../Dashboard";
import ApiService from "../../services/api";

jest.mock("../../services/api");
const mockApiService = ApiService as jest.Mocked<typeof ApiService>;

const MockedDashboard = () => (
  <BrowserRouter>
    <Dashboard />
  </BrowserRouter>
);

describe("Dashboard", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockApiService.getAnalyses.mockResolvedValue({
      analyses: [],
      meta: {
        limit: undefined,
        offset: undefined,
      },
    });
  });

  it("renders the main dashboard elements", async () => {
    render(<MockedDashboard />);

    expect(screen.getByText("Silverlight")).toBeInTheDocument();
    expect(
      screen.getByText("Website Technology Analysis Dashboard")
    ).toBeInTheDocument();

    expect(screen.getByLabelText("Website URL")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /analyze/i })
    ).toBeInTheDocument();

    expect(screen.getByText("Analyzing Targets")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("No Analyses Yet")).toBeInTheDocument();
    });
  });

  it("validates URL input correctly", async () => {
    render(<MockedDashboard />);

    const urlInput = screen.getByLabelText("Website URL");
    const analyzeButton = screen.getByRole("button", { name: /analyze/i });

    expect(analyzeButton).toBeDisabled();

    fireEvent.change(urlInput, { target: { value: "invalid-url" } });
    expect(analyzeButton).toBeDisabled();

    fireEvent.change(urlInput, { target: { value: "https://example.com" } });
    await waitFor(() => {
      expect(analyzeButton).not.toBeDisabled();
    });
  });

  it("submits form with valid URL", async () => {
    const mockAnalysis = {
      id: "test-id",
      url: "https://example.com",
      status: "analyzing" as const,
      technologies: [],
      linkCount: 0,
      createdAt: "2023-01-01T00:00:00.000Z",
    };

    mockApiService.startAnalysis.mockResolvedValue(mockAnalysis);
    mockApiService.getAnalyses.mockResolvedValue({
      analyses: [mockAnalysis],
      meta: {
        limit: undefined,
        offset: undefined,
      },
    });

    render(<MockedDashboard />);

    const urlInput = screen.getByLabelText("Website URL");
    const analyzeButton = screen.getByRole("button", { name: /analyze/i });

    fireEvent.change(urlInput, { target: { value: "https://example.com" } });
    fireEvent.click(analyzeButton);

    await waitFor(() => {
      expect(mockApiService.startAnalysis).toHaveBeenCalledWith({
        url: "https://example.com",
      });
    });

    expect(urlInput).toHaveValue("");
  });

  it("displays error for invalid URL submission", async () => {
    render(<MockedDashboard />);

    const urlInput = screen.getByLabelText("Website URL");
    const form = urlInput.closest("form")!;

    fireEvent.change(urlInput, { target: { value: "invalid-url" } });
    fireEvent.submit(form);

    await waitFor(() => {
      expect(
        screen.getByText("Please enter a valid HTTP/HTTPS URL")
      ).toBeInTheDocument();
    });
  });

  it("displays analyses list when data is available", async () => {
    const mockAnalyses = [
      {
        id: "test-1",
        url: "https://example1.com",
        status: "completed" as const,
        technologies: [],
        linkCount: 10,
        createdAt: "2023-01-01T00:00:00.000Z",
        completedAt: "2023-01-01T00:01:00.000Z",
      },
      {
        id: "test-2",
        url: "https://example2.com",
        status: "analyzing" as const,
        technologies: [],
        linkCount: 0,
        createdAt: "2023-01-01T00:02:00.000Z",
      },
    ];

    mockApiService.getAnalyses.mockResolvedValue({
      analyses: mockAnalyses,
      meta: {
        limit: undefined,
        offset: undefined,
      },
    });

    render(<MockedDashboard />);

    await waitFor(() => {
      expect(screen.getByText("example1.com")).toBeInTheDocument();
      expect(screen.getByText("example2.com")).toBeInTheDocument();
    });

    expect(screen.getByText("Completed")).toBeInTheDocument();
    expect(screen.getByText("Analyzing")).toBeInTheDocument();

    expect(screen.getByText("View More")).toBeInTheDocument();
  });

  it("handles API errors gracefully", async () => {
    mockApiService.getAnalyses.mockRejectedValue(new Error("API Error"));

    render(<MockedDashboard />);

    await waitFor(() => {
      expect(
        screen.getByText("Failed to load analyses. Please try again.")
      ).toBeInTheDocument();
    });
  });
});
