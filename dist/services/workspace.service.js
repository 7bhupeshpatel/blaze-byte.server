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
exports.workspaceService = void 0;
const db_config_1 = __importDefault(require("../config/db.config"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
exports.workspaceService = {
    addStaff(adminId, staffData) {
        return __awaiter(this, void 0, void 0, function* () {
            const admin = yield db_config_1.default.user.findUnique({
                where: { id: adminId },
                include: { managedCompany: true }
            });
            if (!(admin === null || admin === void 0 ? void 0 : admin.managedCompany))
                throw new Error("Workspace not found.");
            const hashedPassword = yield bcryptjs_1.default.hash(staffData.password, 10);
            return yield db_config_1.default.user.create({
                data: {
                    email: staffData.email,
                    password: hashedPassword,
                    role: 'VISITOR',
                    companyId: admin.managedCompany.id,
                    isVerified: true
                }
            });
        });
    },
    addProduct(adminId, productData) {
        return __awaiter(this, void 0, void 0, function* () {
            const admin = yield db_config_1.default.user.findUnique({
                where: { id: adminId },
                include: { managedCompany: true }
            });
            if (!(admin === null || admin === void 0 ? void 0 : admin.managedCompany))
                throw new Error("Workspace not found.");
            return yield db_config_1.default.product.create({
                data: {
                    name: productData.name,
                    price: parseFloat(productData.price),
                    category: productData.category || "General",
                    stock: productData.stock ? parseInt(productData.stock) : 0,
                    companyId: admin.managedCompany.id
                }
            });
        });
    },
    getWorkspaceInventory(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield db_config_1.default.user.findUnique({
                where: { id: userId },
                include: { managedCompany: true }
            });
            if (!user)
                throw new Error("User not found");
            if (user.role === "SUPERADMIN") {
                return db_config_1.default.product.findMany({
                    orderBy: { createdAt: "desc" }
                });
            }
            if (user.role === "ADMIN") {
                if (!user.managedCompany)
                    throw new Error("Admin has no workspace.");
                return db_config_1.default.product.findMany({
                    where: { companyId: user.managedCompany.id },
                    orderBy: { createdAt: "desc" }
                });
            }
            if (user.role === "VISITOR") {
                if (!user.companyId)
                    throw new Error("Staff not assigned to workspace.");
                return db_config_1.default.product.findMany({
                    where: { companyId: user.companyId },
                    orderBy: { createdAt: "desc" }
                });
            }
            throw new Error("User role not allowed for inventory access.");
        });
    },
    getWorkspaceStaff(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield db_config_1.default.user.findUnique({
                where: { id: userId },
                include: { managedCompany: true }
            });
            if (!user)
                throw new Error("User not found");
            if (user.role === "SUPERADMIN") {
                return db_config_1.default.user.findMany({
                    where: { role: "VISITOR" },
                    select: {
                        id: true,
                        email: true,
                        isActive: true,
                        isVerified: true,
                        createdAt: true,
                        companyId: true,
                        company: true,
                        managedCompany: true
                    },
                    orderBy: { createdAt: "desc" }
                });
            }
            if (user.role === "ADMIN") {
                if (!user.managedCompany)
                    throw new Error("Admin has no workspace.");
                return db_config_1.default.user.findMany({
                    where: {
                        role: "VISITOR",
                        companyId: user.managedCompany.id
                    },
                    select: {
                        id: true,
                        email: true,
                        isActive: true,
                        isVerified: true,
                        createdAt: true,
                        company: true
                    },
                    orderBy: { createdAt: "desc" }
                });
            }
            throw new Error("Access denied.");
        });
    },
    updateProduct(adminId, productId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const admin = yield db_config_1.default.user.findUnique({
                where: { id: adminId },
                include: { managedCompany: true }
            });
            if (!(admin === null || admin === void 0 ? void 0 : admin.managedCompany))
                throw new Error("Workspace not found.");
            const product = yield db_config_1.default.product.findUnique({
                where: { id: productId }
            });
            if (!product || product.companyId !== admin.managedCompany.id)
                throw new Error("Unauthorized to update this product.");
            return db_config_1.default.product.update({
                where: { id: productId },
                data: Object.assign(Object.assign(Object.assign(Object.assign({}, (data.name && { name: data.name })), (data.price && { price: parseFloat(data.price) })), (data.category && { category: data.category })), (data.stock !== undefined && { stock: parseInt(data.stock) }))
            });
        });
    },
    deleteProduct(adminId, productId) {
        return __awaiter(this, void 0, void 0, function* () {
            const admin = yield db_config_1.default.user.findUnique({
                where: { id: adminId },
                include: { managedCompany: true }
            });
            if (!(admin === null || admin === void 0 ? void 0 : admin.managedCompany))
                throw new Error("Workspace not found.");
            const product = yield db_config_1.default.product.findUnique({
                where: { id: productId }
            });
            if (!product || product.companyId !== admin.managedCompany.id)
                throw new Error("Unauthorized to delete this product.");
            return db_config_1.default.product.delete({
                where: { id: productId }
            });
        });
    },
    updateStaff(adminId, staffId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const admin = yield db_config_1.default.user.findUnique({
                where: { id: adminId },
                include: { managedCompany: true }
            });
            if (!(admin === null || admin === void 0 ? void 0 : admin.managedCompany))
                throw new Error("Workspace not found.");
            const staff = yield db_config_1.default.user.findUnique({
                where: { id: staffId }
            });
            if (!staff || staff.companyId !== admin.managedCompany.id)
                throw new Error("Unauthorized to update this staff.");
            const updateData = {};
            if (data.email)
                updateData.email = data.email;
            if (data.isActive !== undefined)
                updateData.isActive = data.isActive;
            if (data.isVerified !== undefined)
                updateData.isVerified = data.isVerified;
            if (data.password) {
                updateData.password = yield bcryptjs_1.default.hash(data.password, 10);
            }
            return db_config_1.default.user.update({
                where: { id: staffId },
                data: updateData
            });
        });
    },
    deleteStaff(adminId, staffId) {
        return __awaiter(this, void 0, void 0, function* () {
            const admin = yield db_config_1.default.user.findUnique({
                where: { id: adminId },
                include: { managedCompany: true }
            });
            if (!(admin === null || admin === void 0 ? void 0 : admin.managedCompany))
                throw new Error("Workspace not found.");
            const staff = yield db_config_1.default.user.findUnique({
                where: { id: staffId }
            });
            if (!staff || staff.companyId !== admin.managedCompany.id)
                throw new Error("Unauthorized to delete this staff.");
            return db_config_1.default.user.delete({
                where: { id: staffId }
            });
        });
    }
};
//# sourceMappingURL=workspace.service.js.map