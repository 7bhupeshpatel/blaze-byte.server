"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ success: false, message: "No token provided, authorization denied" });
        return;
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(401).json({ success: false, message: "Token is not valid" });
        return;
    }
};
exports.verifyToken = verifyToken;
const authorize = (roles) => {
    return (req, res, next) => {
        var _a;
        const user = req.user;
        console.log("Required Roles:", roles);
        console.log("User Role:", (_a = req.user) === null || _a === void 0 ? void 0 : _a.role);
        if (!user || !roles.includes(user.role)) {
            res.status(403).json({ success: false, message: "Access Denied: Insufficient permissions" });
            return;
        }
        if (user.isActive === false) {
            res.status(403).json({ success: false, message: "Account suspended. Contact administrator." });
            return;
        }
        if (user.isValidTill && new Date() > new Date(user.isValidTill)) {
            res.status(403).json({ success: false, message: "Account access has expired" });
            return;
        }
        next();
    };
};
exports.authorize = authorize;
//# sourceMappingURL=auth.middleware.js.map