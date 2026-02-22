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
            var _a;
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
            const startOfYear = new Date(now.getFullYear(), 0, 1);
            const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
            const [daily, weekly, monthly, yearly, dailyCash, dailyOnline, monthlyCash, monthlyOnline, todayOrders, monthOrders, lastMonthSales] = yield Promise.all([
                db_config_1.default.sale.aggregate({
                    _sum: { totalAmount: true },
                    where: { staff: { companyId }, createdAt: { gte: startOfDay } }
                }),
                db_config_1.default.sale.aggregate({
                    _sum: { totalAmount: true },
                    where: { staff: { companyId }, createdAt: { gte: startOfWeek } }
                }),
                db_config_1.default.sale.aggregate({
                    _sum: { totalAmount: true },
                    where: { staff: { companyId }, createdAt: { gte: startOfMonth } }
                }),
                db_config_1.default.sale.aggregate({
                    _sum: { totalAmount: true },
                    where: { staff: { companyId }, createdAt: { gte: startOfYear } }
                }),
                db_config_1.default.sale.aggregate({
                    _sum: { totalAmount: true },
                    where: {
                        staff: { companyId },
                        createdAt: { gte: startOfDay },
                        paymentMethod: "CASH"
                    }
                }),
                db_config_1.default.sale.aggregate({
                    _sum: { totalAmount: true },
                    where: {
                        staff: { companyId },
                        createdAt: { gte: startOfDay },
                        paymentMethod: "ONLINE"
                    }
                }),
                db_config_1.default.sale.aggregate({
                    _sum: { totalAmount: true },
                    where: {
                        staff: { companyId },
                        createdAt: { gte: startOfMonth },
                        paymentMethod: "CASH"
                    }
                }),
                db_config_1.default.sale.aggregate({
                    _sum: { totalAmount: true },
                    where: {
                        staff: { companyId },
                        createdAt: { gte: startOfMonth },
                        paymentMethod: "ONLINE"
                    }
                }),
                db_config_1.default.sale.count({
                    where: { staff: { companyId }, createdAt: { gte: startOfDay } }
                }),
                db_config_1.default.sale.count({
                    where: { staff: { companyId }, createdAt: { gte: startOfMonth } }
                }),
                db_config_1.default.sale.aggregate({
                    _sum: { totalAmount: true },
                    where: {
                        staff: { companyId },
                        createdAt: {
                            gte: startOfLastMonth,
                            lte: endOfLastMonth
                        }
                    }
                })
            ]);
            const averageOrderValue = monthOrders > 0
                ? (monthly._sum.totalAmount || 0) / monthOrders
                : 0;
            const currentMonth = monthly._sum.totalAmount || 0;
            const previousMonth = lastMonthSales._sum.totalAmount || 0;
            const monthlyGrowthPercent = previousMonth > 0
                ? ((currentMonth - previousMonth) / previousMonth) * 100
                : 0;
            const isGrowing = monthlyGrowthPercent >= 0;
            const topProduct = yield db_config_1.default.saleItem.groupBy({
                by: ['productId'],
                _sum: { quantity: true },
                orderBy: { _sum: { quantity: 'desc' } },
                take: 1,
                where: {
                    sale: { staff: { companyId } }
                }
            });
            let productInfo = null;
            if (topProduct.length > 0) {
                productInfo = yield db_config_1.default.product.findUnique({
                    where: { id: topProduct[0].productId }
                });
            }
            const categoryItems = yield db_config_1.default.saleItem.findMany({
                where: {
                    sale: { staff: { companyId } }
                },
                include: { product: true }
            });
            const categoryMap = {};
            categoryItems.forEach(item => {
                const category = item.product.category || "General";
                categoryMap[category] =
                    (categoryMap[category] || 0) + item.quantity;
            });
            const categoryBreakdown = Object.entries(categoryMap).map(([category, quantity]) => ({ category, quantity }));
            const mostSoldCategory = ((_a = categoryBreakdown.sort((a, b) => b.quantity - a.quantity)[0]) === null || _a === void 0 ? void 0 : _a.category) || null;
            return {
                daily: daily._sum.totalAmount || 0,
                weekly: weekly._sum.totalAmount || 0,
                monthly: monthly._sum.totalAmount || 0,
                yearly: yearly._sum.totalAmount || 0,
                dailyCash: dailyCash._sum.totalAmount || 0,
                dailyOnline: dailyOnline._sum.totalAmount || 0,
                monthlyCash: monthlyCash._sum.totalAmount || 0,
                monthlyOnline: monthlyOnline._sum.totalAmount || 0,
                totalOrdersToday: todayOrders,
                totalOrdersMonth: monthOrders,
                averageOrderValue,
                monthlyGrowthPercent,
                isGrowing,
                mostSoldProduct: productInfo,
                mostSoldCategory,
                categoryBreakdown
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
            const [daily, weekly, monthly, dailyCash, dailyOnline, monthlyCash, monthlyOnline] = yield Promise.all([
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
                }),
                db_config_1.default.sale.aggregate({
                    _sum: { totalAmount: true },
                    where: {
                        staffId: userId,
                        createdAt: { gte: startOfDay },
                        paymentMethod: "CASH"
                    }
                }),
                db_config_1.default.sale.aggregate({
                    _sum: { totalAmount: true },
                    where: {
                        staffId: userId,
                        createdAt: { gte: startOfDay },
                        paymentMethod: "ONLINE"
                    }
                }),
                db_config_1.default.sale.aggregate({
                    _sum: { totalAmount: true },
                    where: {
                        staffId: userId,
                        createdAt: { gte: startOfMonth },
                        paymentMethod: "CASH"
                    }
                }),
                db_config_1.default.sale.aggregate({
                    _sum: { totalAmount: true },
                    where: {
                        staffId: userId,
                        createdAt: { gte: startOfMonth },
                        paymentMethod: "ONLINE"
                    }
                })
            ]);
            return {
                daily: daily._sum.totalAmount || 0,
                weekly: weekly._sum.totalAmount || 0,
                monthly: monthly._sum.totalAmount || 0,
                dailyCash: dailyCash._sum.totalAmount || 0,
                dailyOnline: dailyOnline._sum.totalAmount || 0,
                monthlyCash: monthlyCash._sum.totalAmount || 0,
                monthlyOnline: monthlyOnline._sum.totalAmount || 0
            };
        });
    }
};
//# sourceMappingURL=analytics.service.js.map