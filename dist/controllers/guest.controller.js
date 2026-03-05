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
exports.placeGuestOrder = exports.getOrderStatus = exports.getCompanyMenu = void 0;
const guest_service_1 = require("../services/guest.service");
const getCompanyMenu = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const companyId = req.params.companyId;
        const menuData = yield guest_service_1.GuestService.getMenu(companyId);
        return res.status(200).json({ success: true, data: menuData });
    }
    catch (error) {
        return res.status(404).json({ success: false, message: error.message });
    }
});
exports.getCompanyMenu = getCompanyMenu;
const getOrderStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orderId = req.params.orderId;
        const order = yield guest_service_1.GuestService.getOrderStatus(orderId);
        return res.status(200).json({
            success: true,
            data: order
        });
    }
    catch (error) {
        return res.status(404).json({
            success: false,
            message: error.message
        });
    }
});
exports.getOrderStatus = getOrderStatus;
const placeGuestOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const companyId = req.params.companyId;
        const { items, customerName, customerPhone, paymentMethod } = req.body;
        const guestId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!customerName || !items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ success: false, message: "Missing required fields or empty cart" });
        }
        const order = yield guest_service_1.GuestService.placeOrder(companyId, items, customerName, paymentMethod, customerPhone, guestId);
        return res.status(201).json({
            success: true,
            message: "Order placed successfully. Awaiting confirmation.",
            data: order
        });
    }
    catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
});
exports.placeGuestOrder = placeGuestOrder;
//# sourceMappingURL=guest.controller.js.map