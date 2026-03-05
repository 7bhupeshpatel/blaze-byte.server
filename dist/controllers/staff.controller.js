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
exports.updatePaymentStatus = exports.getMySales = exports.createSale = exports.getProductsForStaff = void 0;
const staff_service_1 = require("../services/staff.service");
const getProductsForStaff = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield staff_service_1.staffService.getCompanyProducts(req.user.id);
        res.json({ success: true, data: products });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});
exports.getProductsForStaff = getProductsForStaff;
const createSale = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sale = yield staff_service_1.staffService.createSale(req.user.id, req.body.items, req.body.customer, req.body.discountPercent, req.body.paymentMethod);
        res.json({ success: true, data: sale });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});
exports.createSale = createSale;
const getMySales = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sales = yield staff_service_1.staffService.getMySales(req.user.id);
        res.json({ success: true, data: sales });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});
exports.getMySales = getMySales;
const updatePaymentStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const saleId = req.params.id;
        const { paymentStatus } = req.body;
        if (!paymentStatus || !['PAID', 'PENDING', 'FAILED'].includes(paymentStatus)) {
            return res.status(400).json({ success: false, message: "Invalid payment status provided." });
        }
        const updatedSale = yield staff_service_1.staffService.updatePaymentStatus(req.user.id, saleId, paymentStatus);
        res.json({ success: true, data: updatedSale });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});
exports.updatePaymentStatus = updatePaymentStatus;
//# sourceMappingURL=staff.controller.js.map