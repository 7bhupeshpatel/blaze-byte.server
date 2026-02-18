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
exports.fetchAuditLogs = exports.fetchStats = exports.bulkDelete = exports.modifyUser = exports.fetchAllUsers = void 0;
const admin_service_1 = require("../services/admin.service");
const fetchAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { search } = req.query;
        const users = yield admin_service_1.adminService.getAllUsers(search);
        res.json({ success: true, data: users });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.fetchAllUsers = fetchAllUsers;
const modifyUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const adminId = req.user.id;
        if (id === adminId && req.body.isActive === false) {
            res.status(400).json({
                success: false,
                message: "You cannot deactivate your own administrative account."
            });
        }
        const updatedUser = yield admin_service_1.adminService.updateUser(id, req.body, adminId);
        return res.json({ success: true, message: "User updated successfully", data: updatedUser });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});
exports.modifyUser = modifyUser;
const bulkDelete = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { ids } = req.body;
        yield admin_service_1.adminService.deleteUsers(ids);
        res.json({ success: true, message: "Users purged successfully" });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.bulkDelete = bulkDelete;
const fetchStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const stats = yield admin_service_1.adminService.getStats();
        res.json({ success: true, data: stats });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.fetchStats = fetchStats;
const fetchAuditLogs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const logs = yield admin_service_1.adminService.getAuditLogs();
        res.json({ success: true, data: logs });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.fetchAuditLogs = fetchAuditLogs;
//# sourceMappingURL=admin.controller.js.map