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
exports.inventoryService = void 0;
const db_config_1 = __importDefault(require("../config/db.config"));
exports.inventoryService = {
    addInventory(companyId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_config_1.default.inventory.create({
                data: {
                    name: data.name,
                    category: data.category,
                    quantity: parseFloat(data.quantity),
                    unit: data.unit,
                    cost: parseFloat(data.cost),
                    supplier: data.supplier,
                    paymentMethod: data.paymentMethod,
                    purchaseDate: data.purchaseDate ? new Date(data.purchaseDate) : new Date(),
                    companyId: companyId
                }
            });
        });
    },
    getInventory(companyId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_config_1.default.inventory.findMany({
                where: { companyId },
                orderBy: { purchaseDate: 'desc' }
            });
        });
    }
};
//# sourceMappingURL=inventory.service.js.map