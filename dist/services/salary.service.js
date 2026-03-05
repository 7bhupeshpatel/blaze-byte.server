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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.salaryService = void 0;
const db_config_1 = __importDefault(require("../config/db.config"));
exports.salaryService = {
    recordSalary(companyId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_config_1.default.salary.create({
                data: {
                    userId: data.userId,
                    companyId: companyId,
                    amount: parseFloat(data.amount),
                    month: parseInt(data.month),
                    year: parseInt(data.year),
                    status: data.status,
                    paymentMethod: data.paymentMethod,
                    paymentDate: data.paymentDate ? new Date(data.paymentDate) : new Date(),
                    notes: data.notes
                }
            });
        });
    },
    getCompanySalaries(companyId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_config_1.default.salary.findMany({
                where: { companyId },
                include: {
                    user: { select: { id: true, email: true, metadata: true } }
                },
                orderBy: { paymentDate: 'desc' }
            });
        });
    }
};
//# sourceMappingURL=salary.service.js.map