"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = void 0;
const authorize = (roles) => {
    return (req, res, next) => {
        const user = req.user;
        if (!user || !roles.includes(user.role)) {
            res.status(403).json({ message: "Access Denied" });
            return;
        }
        if (!user.isActive || (user.isValidTill && new Date() > user.isValidTill)) {
            res.status(403).json({ message: "Account suspended or expired" });
            return;
        }
        next();
    };
};
exports.authorize = authorize;
//# sourceMappingURL=auth.middleware.js.map