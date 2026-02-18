import prisma from '../config/db.config';
import bcrypt from 'bcryptjs';
import { UserUpdateInput } from '../types/admin.types';

export const adminService = {
  
  async getAllUsers(search?: string) {
    try {
      return await prisma.user.findMany({
        where: search
          ? {
              OR: [
                { email: { contains: search, mode: 'insensitive' } },
                { id: { contains: search } }
              ]
            }
          : {},
        orderBy: { createdAt: 'desc' }
      });
    } catch (error: any) {
      console.error('AdminService:getAllUsers Error →', error);
      throw new Error('Failed to fetch users');
    }
  },

async updateUser(userId: string, data: any, adminId: string) {
  try {
    // Normalize Date
    if (data.isValidTill) {
      data.isValidTill = new Date(data.isValidTill);
    } else {
      data.isValidTill = null;
    }

    // Get current user state
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      include: { managedCompany: true }
    });

    if (!existingUser) throw new Error("User not found");

    // Update user role/status first
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { ...data }
    });

    // 🔥 If promoted to ADMIN and doesn't already own workspace
    if (
      data.role === "ADMIN" &&
      !existingUser.managedCompany
    ) {
      await prisma.company.create({
        data: {
          name: `${updatedUser.email.split("@")[0]}'s Workspace`,
          ownerId: userId
        }
      });
    }

    // 🔥 If downgraded from ADMIN → remove company (optional safety)
    if (
      existingUser.role === "ADMIN" &&
      data.role !== "ADMIN"
    ) {
      await prisma.company.deleteMany({
        where: { ownerId: userId }
      });
    }

    // Audit log
    await prisma.auditLog.create({
      data: {
        adminId,
        action: "UPDATE_USER",
        targetId: userId,
        details: JSON.stringify(data)
      }
    });

    return updatedUser;

  } catch (error: any) {
    console.log("Update Error:", error);

    if (error.code === "P2025") {
      throw new Error("User not found");
    }

    throw new Error("Update failed");
  }
},

async getAuditLogs() {
  return await prisma.auditLog.findMany({
    include: { admin: { select: { email: true } } },
    orderBy: { createdAt: 'desc' },
    take: 50
  });
},

  async deleteUsers(userIds: string[]) {
    try {
      return await prisma.user.deleteMany({
        where: { id: { in: userIds } }
      });
    } catch (error: any) {
      console.error('AdminService:deleteUsers Error →', error);
      throw new Error('Failed to delete users');
    }
  },

  async getStats() {
    try {
      const [total, active, roles] = await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { isActive: true } }),
        prisma.user.groupBy({
          by: ['role'],
          _count: { role: true }
        })
      ]);

      return {
        totalUsers: total,
        activeUsers: active,
        pendingUsers: total - active,
        roleDistribution: roles
      };

    } catch (error: any) {
      console.error('AdminService:getStats Error →', error);
      throw new Error('Failed to fetch admin statistics');
    }
  }
};
