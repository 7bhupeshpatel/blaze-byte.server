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
exports.resetPassword = exports.requestPasswordReset = exports.loginUser = exports.verifyAndActivate = exports.registerUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_config_1 = __importDefault(require("../config/db.config"));
const client_1 = require("@prisma/client");
const emai_util_1 = require("../utils/emai.util");
const registerUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const existingUser = yield db_config_1.default.user.findUnique({ where: { email: data.email } });
    if (existingUser)
        throw new Error("User already exists");
    const hashedPassword = yield bcryptjs_1.default.hash(data.password, 12);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    const user = yield db_config_1.default.user.create({
        data: {
            email: data.email,
            password: hashedPassword,
            otp,
            otpExpires,
            role: client_1.Role.GUEST,
            metadata: data.metadata || {},
        },
    });
    yield (0, emai_util_1.sendEmail)(data.email, "Verify your Account", `Your OTP is: ${otp}`);
    return user;
});
exports.registerUser = registerUser;
const verifyAndActivate = (email, otp) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield db_config_1.default.user.findUnique({ where: { email } });
    if (!user || user.otp !== otp || (user.otpExpires && user.otpExpires < new Date())) {
        throw new Error("Invalid or expired OTP");
    }
    return yield db_config_1.default.user.update({
        where: { email },
        data: { isVerified: true, otp: null, otpExpires: null },
    });
});
exports.verifyAndActivate = verifyAndActivate;
const loginUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield db_config_1.default.user.findUnique({ where: { email: data.email } });
    if (!user || !user.isVerified)
        throw new Error("Invalid credentials or unverified account");
    const isMatch = yield bcryptjs_1.default.compare(data.password, user.password);
    if (!isMatch)
        throw new Error("Invalid credentials");
    if (!user.isActive)
        throw new Error("Account is suspended");
    const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    return { token, user: { id: user.id, email: user.email, role: user.role } };
});
exports.loginUser = loginUser;
const requestPasswordReset = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield db_config_1.default.user.findUnique({ where: { email } });
    if (!user)
        throw new Error("If an account exists with this email, an OTP has been sent.");
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    yield db_config_1.default.user.update({
        where: { email },
        data: { otp, otpExpires }
    });
    yield (0, emai_util_1.sendEmail)(email, "Password Reset OTP", `Your password reset code is: ${otp}`);
    return true;
});
exports.requestPasswordReset = requestPasswordReset;
const resetPassword = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp, newPassword } = data;
    const user = yield db_config_1.default.user.findUnique({ where: { email } });
    if (!user || user.otp !== otp || (user.otpExpires && user.otpExpires < new Date())) {
        throw new Error("Invalid or expired OTP");
    }
    const hashedPassword = yield bcryptjs_1.default.hash(newPassword, 12);
    yield db_config_1.default.user.update({
        where: { email },
        data: {
            password: hashedPassword,
            otp: null,
            otpExpires: null
        }
    });
    return true;
});
exports.resetPassword = resetPassword;
//# sourceMappingURL=auth.service.js.map