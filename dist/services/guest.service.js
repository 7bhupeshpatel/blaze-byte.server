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
exports.GuestService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class GuestService {
    static getOrderStatus(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            const order = yield prisma.sale.findUnique({
                where: { id: orderId },
                select: {
                    id: true,
                    status: true
                }
            });
            if (!order) {
                throw new Error("Order not found");
            }
            return order;
        });
    }
    ;
    static getMenu(companyId) {
        return __awaiter(this, void 0, void 0, function* () {
            const company = yield prisma.company.findUnique({
                where: { id: companyId },
                select: {
                    id: true,
                    name: true,
                    products: {
                        where: { stock: { gt: 0 } },
                        select: { id: true, name: true, price: true, category: true, stock: true }
                    }
                }
            });
            if (!company)
                throw new Error("Company not found");
            return company;
        });
    }
    static placeOrder(companyId, items, customerName, paymentMethod, customerPhone, guestId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!items || items.length === 0)
                throw new Error("Cart is empty");
            const productIds = items.map(i => i.productId);
            const dbProducts = yield prisma.product.findMany({
                where: { id: { in: productIds }, companyId }
            });
            if (dbProducts.length !== items.length) {
                throw new Error("Invalid products in cart.");
            }
            let subtotal = 0;
            const saleItemsData = items.map(item => {
                const product = dbProducts.find(p => p.id === item.productId);
                if (product.stock !== null && product.stock < item.quantity) {
                    throw new Error(`Insufficient stock for ${product.name}`);
                }
                subtotal += product.price * item.quantity;
                return { productId: item.productId, quantity: item.quantity };
            });
            const orderNumber = Math.floor(1000 + Math.random() * 9000).toString();
            const sale = yield prisma.sale.create({
                data: {
                    companyId,
                    guestId: guestId !== null && guestId !== void 0 ? guestId : null,
                    status: client_1.OrderStatus.PENDING,
                    orderNumber,
                    subtotalAmount: subtotal,
                    totalAmount: subtotal,
                    paymentMethod: paymentMethod,
                    customerName,
                    customerPhone: customerPhone !== null && customerPhone !== void 0 ? customerPhone : null,
                    items: {
                        create: saleItemsData
                    }
                },
                include: { items: { include: { product: true } } }
            });
            return sale;
        });
    }
}
exports.GuestService = GuestService;
//# sourceMappingURL=guest.service.js.map