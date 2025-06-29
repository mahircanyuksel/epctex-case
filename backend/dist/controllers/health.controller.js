"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthController = void 0;
class HealthController {
    constructor() {
        this.getHealth = (req, res) => {
            res.json({
                status: "OK",
                message: "Silverlight Backend is running",
                timestamp: new Date().toISOString(),
            });
        };
    }
}
exports.HealthController = HealthController;
//# sourceMappingURL=health.controller.js.map