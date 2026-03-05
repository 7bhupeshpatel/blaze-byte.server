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
exports.updateOrderStatus = exports.confirmOrder = exports.getOrders = void 0;
const order_service_1 = require("../services/order.service");
const getOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const companyId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.companyId;
        const status = req.query.status;
        if (!companyId) {
            return res.status(401).json({
                success: false,
                message: "No company associated"
            });
        }
        const orders = yield order_service_1.OrderService.getOrders(companyId, status);
        return res.status(200).json({
            success: true,
            data: orders
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});
exports.getOrders = getOrders;
const confirmOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const saleId = req.params.saleId;
        const staffId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!staffId)
            return res.status(401).json({ message: "Unauthorized" });
        const updated = yield order_service_1.OrderService.confirmOrder(saleId, staffId);
        return res.status(200).json({
            success: true,
            data: updated
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
});
exports.confirmOrder = confirmOrder;
const updateOrderStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const saleId = req.params.saleId;
        const { status } = req.body;
        const updated = yield order_service_1.OrderService.updateStatus(saleId, status);
        return res.status(200).json({
            success: true,
            data: updated
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
});
exports.updateOrderStatus = updateOrderStatus;
//# sourceMappingURL=order.controller.js.map