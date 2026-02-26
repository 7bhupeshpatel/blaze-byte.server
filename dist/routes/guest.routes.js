"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const guest_controller_1 = require("../controllers/guest.controller");
const router = (0, express_1.Router)();
router.get('/:companyId/menu', guest_controller_1.getCompanyMenu);
router.post('/:companyId/order', guest_controller_1.placeGuestOrder);
exports.default = router;
//# sourceMappingURL=guest.routes.js.map