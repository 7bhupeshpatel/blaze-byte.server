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
exports.adminService = void 0;
const db_config_1 = __importDefault(require("../config/db.config"));
exports.adminService = {
    getAllUsers(search) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield db_config_1.default.user.findMany({
                    where: search
                        ? {
                            OR: [
                                { email: { contains: search, mode: 'insensitive' } },
                                { id: { contains: search } }
                            ]
                        }
                        : {},
                    orderBy: { createdAt: 'desc' }
                });
            }
            catch (error) {
                console.error('AdminService:getAllUsers Error →', error);
                throw new Error('Failed to fetch users');
            }
        });
    },
    updateUser(userId, data, adminId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (data.isValidTill) {
                    data.isValidTill = new Date(data.isValidTill);
                }
                else {
                    data.isValidTill = null;
                }
                const existingUser = yield db_config_1.default.user.findUnique({
                    where: { id: userId },
                    include: { managedCompany: true }
                });
                if (!existingUser)
                    throw new Error("User not found");
                const updatedUser = yield db_config_1.default.user.update({
                    where: { id: userId },
                    data: Object.assign({}, data)
                });
                if (data.role === "ADMIN" &&
                    !existingUser.managedCompany) {
                    yield db_config_1.default.company.create({
                        data: {
                            name: `${updatedUser.email.split("@")[0]}'s Workspace`,
                            ownerId: userId
                        }
                    });
                }
                if (existingUser.role === "ADMIN" &&
                    data.role !== "ADMIN") {
                    yield db_config_1.default.company.deleteMany({
                        where: { ownerId: userId }
                    });
                }
                yield db_config_1.default.auditLog.create({
                    data: {
                        adminId,
                        action: "UPDATE_USER",
                        targetId: userId,
                        details: JSON.stringify(data)
                    }
                });
                return updatedUser;
            }
            catch (error) {
                console.log("Update Error:", error);
                if (error.code === "P2025") {
                    throw new Error("User not found");
                }
                throw new Error("Update failed");
            }
        });
    },
    getAuditLogs() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_config_1.default.auditLog.findMany({
                include: { admin: { select: { email: true } } },
                orderBy: { createdAt: 'desc' },
                take: 50
            });
        });
    },
    deleteUsers(userIds) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield db_config_1.default.user.deleteMany({
                    where: { id: { in: userIds } }
                });
            }
            catch (error) {
                console.error('AdminService:deleteUsers Error →', error);
                throw new Error('Failed to delete users');
            }
        });
    },
    getStats() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [total, active, roles] = yield Promise.all([
                    db_config_1.default.user.count(),
                    db_config_1.default.user.count({ where: { isActive: true } }),
                    db_config_1.default.user.groupBy({
                        by: ['role'],
                        _count: { role: true }
                    })
                ]);
                return {
                    totalUsers: total,
                    activeUsers: active,
                    pendingUsers: total - active,
                    roleDistribution: roles
                };
            }
            catch (error) {
                console.error('AdminService:getStats Error →', error);
                throw new Error('Failed to fetch admin statistics');
            }
        });
    }
};
//# sourceMappingURL=admin.service.js.map