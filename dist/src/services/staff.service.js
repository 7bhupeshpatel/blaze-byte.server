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
    createSale(userId, items, customer, discountPercent) {
        return __awaiter(this, void 0, void 0, function* () {
            const staff = yield db_config_1.default.user.findUnique({
                where: { id: userId }
            });
            if (!staff || !staff.companyId)
                throw new Error("Unauthorized.");
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
            return db_config_1.default.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                const sale = yield tx.sale.create({
                    data: {
                        staffId: userId,
                        subtotalAmount,
                        discountPercent: discount,
                        discountAmount,
                        totalAmount,
                        customerName: (customer === null || customer === void 0 ? void 0 : customer.name) || null,
                        customerPhone: (customer === null || customer === void 0 ? void 0 : customer.phone) || null
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
    }
};
//# sourceMappingURL=staff.service.js.map