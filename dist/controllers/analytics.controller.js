"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStaffAnalytics = exports.getAdminAnalytics = void 0;
const analytics_service_1 = require("../services/analytics.service");
const getAdminAnalytics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield analytics_service_1.analyticsService.getAdminAnalytics(req.user.id);
        res.json({ success: true, data });
    }
    catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});
exports.getAdminAnalytics = getAdminAnalytics;
const getStaffAnalytics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield analytics_service_1.analyticsService.getStaffAnalytics(req.user.id);
        res.json({ success: true, data });
    }
    catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});
exports.getStaffAnalytics = getStaffAnalytics;
//# sourceMappingURL=analytics.controller.js.map