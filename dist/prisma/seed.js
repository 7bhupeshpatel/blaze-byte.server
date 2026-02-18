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
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const adapter = new adapter_pg_1.PrismaPg({
    connectionString: process.env.DATABASE_URL,
});
const prisma = new client_1.PrismaClient({
    adapter,
    log: ['query', 'info', 'warn', 'error'],
});
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const adminEmail = 'admin@blazebyte.com';
        const adminPassword = 'Admin@123';
        console.log('--- Start Seeding ---');
        const existingAdmin = yield prisma.user.findUnique({
            where: { email: adminEmail },
        });
        if (existingAdmin) {
            console.log(`Admin with email ${adminEmail} already exists. Skipping...`);
            return;
        }
        const hashedPassword = yield bcryptjs_1.default.hash(adminPassword, 12);
        const superAdmin = yield prisma.user.create({
            data: {
                email: adminEmail,
                password: hashedPassword,
                role: client_1.Role.SUPERADMIN,
                isVerified: true,
                isActive: true,
                metadata: {
                    firstName: 'System',
                    lastName: 'Administrator',
                    note: 'Initial seed account'
                },
            },
        });
        console.log('✅ Super Admin created successfully:');
        console.log(`Email: ${superAdmin.email}`);
        console.log(`Role: ${superAdmin.role}`);
        console.log('--- Seeding Finished ---');
    });
}
main()
    .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}));
//# sourceMappingURL=seed.js.map