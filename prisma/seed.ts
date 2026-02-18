import { PrismaClient, Role } from '@prisma/client';
// import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Load env variables manually for the standalone script
dotenv.config();

// const adapter = new PrismaPg({
//   connectionString: process.env.DATABASE_URL!,
// })

const prisma = new PrismaClient({
  // adapter,  
  log: ['query', 'info', 'warn', 'error'],
})

async function main() {
  const adminEmail = 'admin@blazebyte.com'; // Change this to your email
  const adminPassword = 'Admin@123'; // Change this!

  console.log('--- Start Seeding ---');

  // 1. Check if Admin already exists to avoid duplicates
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log(`Admin with email ${adminEmail} already exists. Skipping...`);
    return;
  }

  // 2. Hash the password
  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  // 3. Create the Super Admin
  const superAdmin = await prisma.user.create({
    data: {
      email: adminEmail,
      password: hashedPassword,
      role: Role.SUPERADMIN,
      isVerified: true,  // Admin doesn't need to verify via OTP
      isActive: true,    // Admin should be active immediately
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
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });