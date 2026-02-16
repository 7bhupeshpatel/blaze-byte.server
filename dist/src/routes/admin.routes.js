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
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const db_config_1 = __importDefault(require("../config/db.config"));
const router = (0, express_1.Router)();
router.patch('/approve-user', (0, auth_middleware_1.authorize)(['SUPERADMIN']), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, role, validTill } = req.body;
    const updatedUser = yield db_config_1.default.user.update({
        where: { id: userId },
        data: { role, isValidTill: new Date(validTill) }
    });
    res.json(updatedUser);
}));
//# sourceMappingURL=admin.routes.js.map