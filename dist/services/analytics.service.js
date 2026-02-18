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
exports.analyticsService = void 0;
const db_config_1 = __importDefault(require("../config/db.config"));
exports.analyticsService = {
    getAdminAnalytics(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const admin = yield db_config_1.default.user.findUnique({
                where: { id: userId },
                include: { managedCompany: true }
            });
            if (!(admin === null || admin === void 0 ? void 0 : admin.managedCompany))
                throw new Error("Workspace not found");
            const companyId = admin.managedCompany.id;
            const now = new Date();
            const startOfDay = new Date(now);
            startOfDay.setHours(0, 0, 0, 0);
            const startOfWeek = new Date(now);
            startOfWeek.setDate(now.getDate() - now.getDay());
            startOfWeek.setHours(0, 0, 0, 0);
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const [daily, weekly, monthly] = yield Promise.all([
                db_config_1.default.sale.aggregate({
                    _sum: { totalAmount: true },
                    where: {
                        createdAt: { gte: startOfDay },
                        staff: { companyId }
                    }
                }),
                db_config_1.default.sale.aggregate({
                    _sum: { totalAmount: true },
                    where: {
                        createdAt: { gte: startOfWeek },
                        staff: { companyId }
                    }
                }),
                db_config_1.default.sale.aggregate({
                    _sum: { totalAmount: true },
                    where: {
                        createdAt: { gte: startOfMonth },
                        staff: { companyId }
                    }
                })
            ]);
            const topProduct = yield db_config_1.default.saleItem.groupBy({
                by: ['productId'],
                _sum: { quantity: true },
                orderBy: { _sum: { quantity: 'desc' } },
                take: 1
            });
            let productInfo = null;
            if (topProduct.length > 0) {
                productInfo = yield db_config_1.default.product.findUnique({
                    where: { id: topProduct[0].productId }
                });
            }
            const categoryData = yield db_config_1.default.saleItem.groupBy({
                by: ['productId'],
                _sum: { quantity: true }
            });
            let categoryMap = {};
            for (const entry of categoryData) {
                const product = yield db_config_1.default.product.findUnique({
                    where: { id: entry.productId }
                });
                if (!product)
                    continue;
                const category = product.category || "General";
                categoryMap[category] =
                    (categoryMap[category] || 0) + (entry._sum.quantity || 0);
            }
            const mostSoldCategory = Object.entries(categoryMap)
                .sort((a, b) => b[1] - a[1])[0];
            return {
                daily: daily._sum.totalAmount || 0,
                weekly: weekly._sum.totalAmount || 0,
                monthly: monthly._sum.totalAmount || 0,
                mostSoldProduct: productInfo,
                mostSoldCategory: (mostSoldCategory === null || mostSoldCategory === void 0 ? void 0 : mostSoldCategory[0]) || null
            };
        });
    },
    getStaffAnalytics(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const now = new Date();
            const startOfDay = new Date(now);
            startOfDay.setHours(0, 0, 0, 0);
            const startOfWeek = new Date(now);
            startOfWeek.setDate(now.getDate() - now.getDay());
            startOfWeek.setHours(0, 0, 0, 0);
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const [daily, weekly, monthly] = yield Promise.all([
                db_config_1.default.sale.aggregate({
                    _sum: { totalAmount: true },
                    where: {
                        staffId: userId,
                        createdAt: { gte: startOfDay }
                    }
                }),
                db_config_1.default.sale.aggregate({
                    _sum: { totalAmount: true },
                    where: {
                        staffId: userId,
                        createdAt: { gte: startOfWeek }
                    }
                }),
                db_config_1.default.sale.aggregate({
                    _sum: { totalAmount: true },
                    where: {
                        staffId: userId,
                        createdAt: { gte: startOfMonth }
                    }
                })
            ]);
            return {
                daily: daily._sum.totalAmount || 0,
                weekly: weekly._sum.totalAmount || 0,
                monthly: monthly._sum.totalAmount || 0
            };
        });
    }
};
//# sourceMappingURL=analytics.service.js.map