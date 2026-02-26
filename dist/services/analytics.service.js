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
            const startOfYear = new Date(now.getFullYear(), 0, 1);
            const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
            const [daily, weekly, monthly, yearly, dailyCash, dailyOnline, monthlyCash, monthlyOnline, totalOrdersToday, totalOrdersMonth, totalOrdersYear, monthlyDiscount, yearlyDiscount, lastMonthRevenue] = yield Promise.all([
                db_config_1.default.sale.aggregate({ _sum: { totalAmount: true }, where: { staff: { companyId }, createdAt: { gte: startOfDay } } }),
                db_config_1.default.sale.aggregate({ _sum: { totalAmount: true }, where: { staff: { companyId }, createdAt: { gte: startOfWeek } } }),
                db_config_1.default.sale.aggregate({ _sum: { totalAmount: true }, where: { staff: { companyId }, createdAt: { gte: startOfMonth } } }),
                db_config_1.default.sale.aggregate({ _sum: { totalAmount: true }, where: { staff: { companyId }, createdAt: { gte: startOfYear } } }),
                db_config_1.default.sale.aggregate({ _sum: { totalAmount: true }, where: { staff: { companyId }, createdAt: { gte: startOfDay }, paymentMethod: "CASH" } }),
                db_config_1.default.sale.aggregate({ _sum: { totalAmount: true }, where: { staff: { companyId }, createdAt: { gte: startOfDay }, paymentMethod: "ONLINE" } }),
                db_config_1.default.sale.aggregate({ _sum: { totalAmount: true }, where: { staff: { companyId }, createdAt: { gte: startOfMonth }, paymentMethod: "CASH" } }),
                db_config_1.default.sale.aggregate({ _sum: { totalAmount: true }, where: { staff: { companyId }, createdAt: { gte: startOfMonth }, paymentMethod: "ONLINE" } }),
                db_config_1.default.sale.count({ where: { staff: { companyId }, createdAt: { gte: startOfDay } } }),
                db_config_1.default.sale.count({ where: { staff: { companyId }, createdAt: { gte: startOfMonth } } }),
                db_config_1.default.sale.count({ where: { staff: { companyId }, createdAt: { gte: startOfYear } } }),
                db_config_1.default.sale.aggregate({ _sum: { discountAmount: true }, where: { staff: { companyId }, createdAt: { gte: startOfMonth } } }),
                db_config_1.default.sale.aggregate({ _sum: { discountAmount: true }, where: { staff: { companyId }, createdAt: { gte: startOfYear } } }),
                db_config_1.default.sale.aggregate({ _sum: { totalAmount: true }, where: { staff: { companyId }, createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } } })
            ]);
            const avgOrderValue = totalOrdersMonth > 0
                ? (monthly._sum.totalAmount || 0) / totalOrdersMonth
                : 0;
            const currentMonth = monthly._sum.totalAmount || 0;
            const previousMonth = lastMonthRevenue._sum.totalAmount || 0;
            const monthlyGrowthPercent = previousMonth > 0
                ? ((currentMonth - previousMonth) / previousMonth) * 100
                : 0;
            const isGrowing = monthlyGrowthPercent >= 0;
            const last7Days = [];
            for (let i = 6; i >= 0; i--) {
                const date = new Date();
                date.setDate(date.getDate() - i);
                const start = new Date(date);
                start.setHours(0, 0, 0, 0);
                const end = new Date(date);
                end.setHours(23, 59, 59, 999);
                const revenue = yield db_config_1.default.sale.aggregate({
                    _sum: { totalAmount: true },
                    where: { staff: { companyId }, createdAt: { gte: start, lte: end } }
                });
                last7Days.push({
                    date: date.toLocaleDateString(),
                    revenue: revenue._sum.totalAmount || 0
                });
            }
            const last12Months = [];
            for (let i = 11; i >= 0; i--) {
                const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
                const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
                const revenue = yield db_config_1.default.sale.aggregate({
                    _sum: { totalAmount: true },
                    where: { staff: { companyId }, createdAt: { gte: monthStart, lte: monthEnd } }
                });
                last12Months.push({
                    month: monthStart.toLocaleString('default', { month: 'short' }),
                    revenue: revenue._sum.totalAmount || 0
                });
            }
            const staffRankingRaw = yield db_config_1.default.sale.groupBy({
                by: ['staffId'],
                _sum: { totalAmount: true },
                where: { staff: { companyId } },
                orderBy: { _sum: { totalAmount: 'desc' } }
            });
            const staffRanking = yield Promise.all(staffRankingRaw.map((s) => __awaiter(this, void 0, void 0, function* () {
                if (!s.staffId)
                    return null;
                const user = yield db_config_1.default.user.findUnique({
                    where: { id: s.staffId }
                });
                return {
                    name: (user === null || user === void 0 ? void 0 : user.email) || "Unknown",
                    revenue: s._sum.totalAmount || 0
                };
            })));
            return {
                daily: daily._sum.totalAmount || 0,
                weekly: weekly._sum.totalAmount || 0,
                monthly: monthly._sum.totalAmount || 0,
                yearly: yearly._sum.totalAmount || 0,
                dailyCash: dailyCash._sum.totalAmount || 0,
                dailyOnline: dailyOnline._sum.totalAmount || 0,
                monthlyCash: monthlyCash._sum.totalAmount || 0,
                monthlyOnline: monthlyOnline._sum.totalAmount || 0,
                totalOrdersToday,
                totalOrdersMonth,
                totalOrdersYear,
                totalDiscountMonth: monthlyDiscount._sum.discountAmount || 0,
                totalDiscountYear: yearlyDiscount._sum.discountAmount || 0,
                averageOrderValue: avgOrderValue,
                monthlyGrowthPercent,
                isGrowing,
                last7Days,
                last12Months,
                staffRanking
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