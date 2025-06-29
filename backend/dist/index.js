"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const routes_1 = __importDefault(require("./routes"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, "../.env") });
console.log("🔍 Environment Debug:");
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("PORT:", process.env.PORT);
console.log("BUILTWITH_API_KEY:", process.env.BUILTWITH_API_KEY ? "✅ Found" : "❌ Not found");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(routes_1.default);
app.listen(PORT, () => {
    console.log(`🚀 Silverlight Backend running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    const builtwithConfigured = Boolean(process.env.BUILTWITH_API_KEY);
    console.log(`🔧 BuiltWith API: ${builtwithConfigured ? "Configured" : "Using mock data"}`);
});
exports.default = app;
//# sourceMappingURL=index.js.map