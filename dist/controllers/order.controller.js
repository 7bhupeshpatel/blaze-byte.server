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
exports.updateOrderStatus = exports.confirmOrder = exports.getPendingOrders = void 0;
const order_service_1 = require("../services/order.service");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getPendingOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const companyId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.companyId;
        if (!companyId) {
            return res.status(401).json({ success: false, message: "No company associated with this user" });
        }
        const orders = yield prisma.sale.findMany({
            where: {
                companyId: companyId,
                status: client_1.OrderStatus.PENDING,
            },
            include: {
                items: {
                    include: { product: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        return res.status(200).json({ success: true, data: orders });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});
exports.getPendingOrders = getPendingOrders;
const confirmOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const saleId = req.params.saleId;
        const staffId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!staffId)
            return res.status(401).json({ message: "Unauthorized" });
        const updatedOrder = yield order_service_1.OrderService.confirmOrder(saleId, staffId);
        return res.status(200).json({
            success: true,
            message: "Order confirmed and stock updated",
            data: updatedOrder
        });
    }
    catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
});
exports.confirmOrder = confirmOrder;
const updateOrderStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const saleId = req.params.saleId;
        const { status } = req.body;
        const updatedOrder = yield prisma.sale.update({
            where: { id: saleId },
            data: { status: status }
        });
        return res.status(200).json({ success: true, data: updatedOrder });
    }
    catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
});
exports.updateOrderStatus = updateOrderStatus;
//# sourceMappingURL=order.controller.js.map