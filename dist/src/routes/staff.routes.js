"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const staff_controller_1 = require("../controllers/staff.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.verifyToken);
router.get('/products', (0, auth_middleware_1.authorize)(['VISITOR']), staff_controller_1.getProductsForStaff);
router.post('/sale', (0, auth_middleware_1.authorize)(['VISITOR']), staff_controller_1.createSale);
router.get('/sales', (0, auth_middleware_1.authorize)(['VISITOR']), staff_controller_1.getMySales);
exports.default = router;
//# sourceMappingURL=staff.routes.js.map