import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import AnalysisDetail from "./components/AnalysisDetail";
import ApiService from "./services/api";

jest.mock("./services/api");
const mockApiService = ApiService as jest.Mocked<typeof ApiService>;

const TestApp = ({ initialEntries = ["/"] }: { initialEntries?: string[] }) => (
  <MemoryRouter initialEntries={initialEntries}>
    <div className="App">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/analysis/:id" element={<AnalysisDetail />} />
      </Routes>
    </div>
  </MemoryRouter>
);

describe("App", () => {
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

  it("renders dashboard on root route", async () => {
    render(<TestApp />);

    expect(screen.getByText("Silverlight")).toBeInTheDocument();
    expect(
      screen.getByText("Website Technology Analysis Dashboard")
    ).toBeInTheDocument();
  });

  it("renders analysis detail on analysis route", async () => {
    const mockAnalysis = {
      id: "test-123",
      url: "https://example.com",
      status: "completed" as const,
      technologies: [
        { name: "React", category: "JavaScript Frameworks", version: "18.0.0" },
      ],
      linkCount: 25,
      createdAt: "2023-01-01T00:00:00.000Z",
      completedAt: "2023-01-01T00:01:00.000Z",
    };

    mockApiService.getAnalysis.mockResolvedValue(mockAnalysis);

    render(<TestApp initialEntries={["/analysis/test-123"]} />);

    await screen.findByText("Analysis Details");
  });
});
