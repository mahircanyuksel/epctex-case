"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const health_routes_1 = __importDefault(require("./health.routes"));
const analysis_routes_1 = __importDefault(require("./analysis.routes"));
const router = (0, express_1.Router)();
router.use("/api", health_routes_1.default);
router.use("/api", analysis_routes_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map