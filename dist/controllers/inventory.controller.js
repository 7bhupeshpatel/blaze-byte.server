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
exports.fetchInventory = exports.addInventory = void 0;
const inventory_service_1 = require("../services/inventory.service");
const addInventory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const companyId = req.user.role === 'ADMIN' ? (_a = req.user.managedCompany) === null || _a === void 0 ? void 0 : _a.id : req.user.companyId;
        if (!companyId)
            return res.status(400).json({ message: "No workspace found." });
        const item = yield inventory_service_1.inventoryService.addInventory(companyId, req.body);
        res.status(201).json({ success: true, data: item });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.addInventory = addInventory;
const fetchInventory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const companyId = req.user.role === 'ADMIN' ? (_a = req.user.managedCompany) === null || _a === void 0 ? void 0 : _a.id : req.user.companyId;
        if (!companyId)
            return res.status(400).json({ message: "No workspace found." });
        const inventory = yield inventory_service_1.inventoryService.getInventory(companyId);
        res.json({ success: true, data: inventory });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.fetchInventory = fetchInventory;
//# sourceMappingURL=inventory.controller.js.map