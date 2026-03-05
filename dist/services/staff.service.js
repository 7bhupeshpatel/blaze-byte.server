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
exports.staffService = void 0;
const db_config_1 = __importDefault(require("../config/db.config"));
exports.staffService = {
    getCompanyProducts(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const staff = yield db_config_1.default.user.findUnique({
                where: { id: userId }
            });
            if (!staff || !staff.companyId)
                throw new Error("Staff not assigned to any company.");
            return db_config_1.default.product.findMany({
                where: { companyId: staff.companyId },
                orderBy: { createdAt: "desc" }
            });
        });
    },
    createSale(userId_1, items_1, customer_1, discountPercent_1, paymentMethod_1) {
        return __awaiter(this, arguments, void 0, function* (userId, items, customer, discountPercent, paymentMethod, isPaid = true) {
            const staff = yield db_config_1.default.user.findUnique({
                where: { id: userId }
            });
            if (!staff || !staff.companyId)
                throw new Error("Unauthorized.");
            const companyId = staff.companyId;
            let subtotalAmount = 0;
            const products = yield db_config_1.default.product.findMany({
                where: {
                    id: { in: items.map(i => i.productId) }
                }
            });
            for (const item of items) {
                const product = products.find(p => p.id === item.productId);
                if (!product)
                    throw new Error("Invalid product.");
                if (product.companyId !== staff.companyId)
                    throw new Error("Invalid company product.");
                if ((product.stock || 0) < item.quantity)
                    throw new Error(`Insufficient stock for ${product.name}`);
                subtotalAmount += product.price * item.quantity;
            }
            const discount = discountPercent || 0;
            const discountAmount = (subtotalAmount * discount) / 100;
            const totalAmount = subtotalAmount - discountAmount;
            const method = paymentMethod || "CASH";
            if (!["CASH", "ONLINE"].includes(method)) {
                throw new Error("Invalid payment method.");
            }
            return db_config_1.default.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                const sale = yield tx.sale.create({
                    data: {
                        staffId: userId,
                        companyId: companyId,
                        subtotalAmount,
                        discountPercent: discount,
                        discountAmount,
                        totalAmount,
                        customerName: (customer === null || customer === void 0 ? void 0 : customer.name) || null,
                        customerPhone: (customer === null || customer === void 0 ? void 0 : customer.phone) || null,
                        paymentMethod: method,
                        paymentStatus: isPaid ? 'PAID' : 'PENDING',
                        items: {
                            create: items.map(item => ({
                                productId: item.productId,
                                quantity: item.quantity
                            }))
                        }
                    },
                    include: {
                        staff: { select: { id: true, email: true } },
                        items: { include: { product: true } }
                    }
                });
                for (const item of items) {
                    yield tx.saleItem.create({
                        data: {
                            saleId: sale.id,
                            productId: item.productId,
                            quantity: item.quantity
                        }
                    });
                    yield tx.product.update({
                        where: { id: item.productId },
                        data: {
                            stock: { decrement: item.quantity }
                        }
                    });
                }
                return sale;
            }));
        });
    },
    getMySales(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return db_config_1.default.sale.findMany({
                where: { staffId: userId },
                include: {
                    staff: {
                        select: {
                            id: true,
                            email: true
                        }
                    },
                    items: {
                        include: {
                            product: true
                        }
                    }
                },
                orderBy: { createdAt: "desc" }
            });
        });
    },
    updatePaymentStatus(userId, saleId, newStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            const staff = yield db_config_1.default.user.findUnique({
                where: { id: userId }
            });
            if (!staff || !staff.companyId) {
                throw new Error("Unauthorized.");
            }
            const sale = yield db_config_1.default.sale.findUnique({
                where: { id: saleId }
            });
            if (!sale) {
                throw new Error("Sale not found.");
            }
            if (sale.companyId !== staff.companyId) {
                throw new Error("Unauthorized to modify this order.");
            }
            if (sale.paymentStatus === newStatus) {
                throw new Error(`Payment status is already ${newStatus}.`);
            }
            if (sale.paymentUpdateCount >= 3) {
                throw new Error("Maximum of 3 payment status changes allowed per order.");
            }
            return db_config_1.default.sale.update({
                where: { id: saleId },
                data: {
                    paymentStatus: newStatus,
                    paymentUpdateCount: { increment: 1 }
                },
                include: {
                    staff: { select: { id: true, email: true } },
                    items: { include: { product: true } }
                }
            });
        });
    }
};
//# sourceMappingURL=staff.service.js.map