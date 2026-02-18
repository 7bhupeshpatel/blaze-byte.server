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
exports.deleteStaff = exports.updateStaff = exports.deleteProduct = exports.updateProduct = exports.fetchStaff = exports.fetchInventory = exports.handleAddProduct = exports.handleAddStaff = void 0;
const workspace_service_1 = require("../services/workspace.service");
const handleAddStaff = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const adminId = req.user.id;
        const staff = yield workspace_service_1.workspaceService.addStaff(adminId, req.body);
        res.json({ success: true, data: staff });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.handleAddStaff = handleAddStaff;
const handleAddProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const adminId = req.user.id;
        const product = yield workspace_service_1.workspaceService.addProduct(adminId, req.body);
        res.json({ success: true, data: product });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.handleAddProduct = handleAddProduct;
const fetchInventory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const inventory = yield workspace_service_1.workspaceService.getWorkspaceInventory(userId);
        res.json({ success: true, data: inventory });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.fetchInventory = fetchInventory;
const fetchStaff = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const staff = yield workspace_service_1.workspaceService.getWorkspaceStaff(req.user.id);
        return res.json({
            success: true,
            data: staff
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
});
exports.fetchStaff = fetchStaff;
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield workspace_service_1.workspaceService.updateProduct(req.user.id, req.params.id, req.body);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});
exports.updateProduct = updateProduct;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield workspace_service_1.workspaceService.deleteProduct(req.user.id, req.params.id);
        res.json({ success: true });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});
exports.deleteProduct = deleteProduct;
const updateStaff = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield workspace_service_1.workspaceService.updateStaff(req.user.id, req.params.id, req.body);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});
exports.updateStaff = updateStaff;
const deleteStaff = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield workspace_service_1.workspaceService.deleteStaff(req.user.id, req.params.id);
        res.json({ success: true });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});
exports.deleteStaff = deleteStaff;
//# sourceMappingURL=workspace.controller.js.map