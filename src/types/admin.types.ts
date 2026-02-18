import { Role } from '@prisma/client';

export interface UserUpdateInput {
  email?: string;
  password?: string;
  role?: Role;
  isActive?: boolean;
  isVerified?: boolean;
  isValidTill?: Date | null;
  metadata?: any;
}

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  pendingUsers: number;
  roleDistribution: Record<string, number>;
}