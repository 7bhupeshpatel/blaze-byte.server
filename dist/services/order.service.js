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
exports.OrderService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class OrderService {
    static getOrders(companyId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.sale.findMany({
                where: Object.assign({ companyId }, (status ? { status } : {})),
                include: {
                    items: {
                        include: { product: true }
                    }
                },
                orderBy: { createdAt: 'desc' }
            });
        });
    }
    static confirmOrder(saleId, staffId) {
        return __awaiter(this, void 0, void 0, function* () {
            const sale = yield prisma.sale.findUnique({
                where: { id: saleId },
                include: { items: true }
            });
            if (!sale)
                throw new Error("Order not found");
            if (sale.status !== client_1.OrderStatus.PENDING)
                throw new Error("Order is not pending");
            return prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                for (const item of sale.items) {
                    const product = yield tx.product.findUnique({
                        where: { id: item.productId }
                    });
                    if (!product || (product.stock !== null && product.stock < item.quantity)) {
                        throw new Error(`Insufficient stock for product ${item.productId}`);
                    }
                    yield tx.product.update({
                        where: { id: item.productId },
                        data: { stock: { decrement: item.quantity } }
                    });
                }
                return tx.sale.update({
                    where: { id: saleId },
                    data: {
                        status: client_1.OrderStatus.CONFIRMED,
                        staffId,
                        paymentStatus: sale.paymentMethod === 'ONLINE' ? 'PAID' : 'PENDING'
                    },
                    include: {
                        items: { include: { product: true } }
                    }
                });
            }));
        });
    }
    static updateStatus(saleId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                const sale = yield tx.sale.findUnique({
                    where: { id: saleId },
                    include: { items: true }
                });
                if (!sale)
                    throw new Error("Order not found");
                if (status === client_1.OrderStatus.COMPLETED) {
                    if (sale.status !== client_1.OrderStatus.PREPARING) {
                        throw new Error("Only PREPARING orders can be completed");
                    }
                }
                return tx.sale.update({
                    where: { id: saleId },
                    data: { status },
                    include: {
                        staff: { select: { id: true, email: true } },
                        items: { include: { product: true } }
                    }
                });
            }));
        });
    }
}
exports.OrderService = OrderService;
//# sourceMappingURL=order.service.js.map