// prisma.config.ts
import { defineConfig } from '@prisma/config';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  datasource: {
    provider: 'postgresql',
    url: process.env.DATABASE_URL, 
  },

  migrations: {
    // This tells Prisma how to run your seed file
    seed: 'ts-node ./prisma/seed.ts',
  },
} as any);