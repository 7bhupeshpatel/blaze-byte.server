"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const workspace_controller_1 = require("../controllers/workspace.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.verifyToken);
router.post('/add-staff', (0, auth_middleware_1.authorize)(['ADMIN']), workspace_controller_1.handleAddStaff);
router.post('/add-product', (0, auth_middleware_1.authorize)(['ADMIN']), workspace_controller_1.handleAddProduct);
router.get('/inventory', (0, auth_middleware_1.authorize)(['ADMIN', 'VISITOR']), workspace_controller_1.fetchInventory);
router.get('/staff', (0, auth_middleware_1.authorize)(['ADMIN', 'SUPERADMIN']), workspace_controller_1.fetchStaff);
router.patch('/product/:id', (0, auth_middleware_1.authorize)(['ADMIN']), workspace_controller_1.updateProduct);
router.delete('/product/:id', (0, auth_middleware_1.authorize)(['ADMIN']), workspace_controller_1.deleteProduct);
router.patch('/staff/:id', (0, auth_middleware_1.authorize)(['ADMIN']), workspace_controller_1.updateStaff);
router.delete('/staff/:id', (0, auth_middleware_1.authorize)(['ADMIN']), workspace_controller_1.deleteStaff);
exports.default = router;
//# sourceMappingURL=workspace.routes.js.map