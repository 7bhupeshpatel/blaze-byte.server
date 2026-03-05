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
exports.fetchSalaries = exports.recordSalary = void 0;
const salary_service_1 = require("../services/salary.service");
const recordSalary = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const companyId = (_a = req.user.managedCompany) === null || _a === void 0 ? void 0 : _a.id;
        if (!companyId)
            return res.status(400).json({ message: "Admin workspace not found." });
        const salary = yield salary_service_1.salaryService.recordSalary(companyId, req.body);
        res.status(201).json({ success: true, data: salary });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.recordSalary = recordSalary;
const fetchSalaries = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const companyId = (_a = req.user.managedCompany) === null || _a === void 0 ? void 0 : _a.id;
        if (!companyId)
            return res.status(400).json({ message: "Admin workspace not found." });
        const salaries = yield salary_service_1.salaryService.getCompanySalaries(companyId);
        res.json({ success: true, data: salaries });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.fetchSalaries = fetchSalaries;
//# sourceMappingURL=salary.controller.js.map