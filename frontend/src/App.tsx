import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import AnalysisDetail from "./components/AnalysisDetail";
import "./styles/global.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/analysis/:id" element={<AnalysisDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
