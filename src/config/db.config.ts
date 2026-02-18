import { PrismaClient } from '@prisma/client';
// import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import dotenv from 'dotenv';

// 1. Force load dotenv in this file to be absolutely sure
dotenv.config();

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// 2. Add a check to catch the error early
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing in .env file");
}

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL 
});

// const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;