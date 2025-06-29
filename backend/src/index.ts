import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import routes from "./routes";

dotenv.config({ path: path.resolve(__dirname, "../.env") });
console.log("🔍 Environment Debug:");
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("PORT:", process.env.PORT);
console.log(
  "BUILTWITH_API_KEY:",
  process.env.BUILTWITH_API_KEY ? "✅ Found" : "❌ Not found"
);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(routes);

// Only start the server if this file is run directly (not imported by tests)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Silverlight Backend running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);

    const builtwithConfigured = Boolean(process.env.BUILTWITH_API_KEY);
    console.log(
      `🔧 BuiltWith API: ${
        builtwithConfigured ? "Configured" : "Using mock data"
      }`
    );
  });
}

export default app;
