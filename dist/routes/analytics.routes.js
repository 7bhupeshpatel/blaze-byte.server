"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const analytics_controller_1 = require("../controllers/analytics.controller");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.verifyToken);
router.get('/admin', (0, auth_middleware_1.authorize)(['ADMIN']), analytics_controller_1.getAdminAnalytics);
router.get('/staff', (0, auth_middleware_1.authorize)(['VISITOR']), analytics_controller_1.getStaffAnalytics);
exports.default = router;
//# sourceMappingURL=analytics.routes.js.map