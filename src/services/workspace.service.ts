import prisma from '../config/db.config';
import bcrypt from 'bcryptjs';

export const workspaceService = {
  // Add Staff (VISITOR role) to the Admin's Company
  async addStaff(adminId: string, staffData: any) {
    const admin = await prisma.user.findUnique({
      where: { id: adminId },
      include: { managedCompany: true }
    });

    if (!admin?.managedCompany) throw new Error("Workspace not found.");

    const hashedPassword = await bcrypt.hash(staffData.password, 10);

    return await prisma.user.create({
      data: {
        email: staffData.email,
        password: hashedPassword,
        role: 'VISITOR', // Using VISITOR as the Staff role
        companyId: admin.managedCompany.id,
        isVerified: true
      }
    });
  },

  // Add Product to the Admin's Catalog
  async addProduct(adminId: string, productData: any) {
    const admin = await prisma.user.findUnique({
      where: { id: adminId },
      include: { managedCompany: true }
    });

    if (!admin?.managedCompany) throw new Error("Workspace not found.");

    return await prisma.product.create({
      data: {
        name: productData.name,
        price: parseFloat(productData.price),
        category: productData.category || "General",
        stock: productData.stock ? parseInt(productData.stock) : 0,
        companyId: admin.managedCompany.id
      }
    });
  },

  // Get Inventory for the current user's workspace
  async getWorkspaceInventory(userId: string) {

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { managedCompany: true }
  });

  if (!user) throw new Error("User not found");

  // SUPERADMIN sees all
  if (user.role === "SUPERADMIN") {
    return prisma.product.findMany({
      orderBy: { createdAt: "desc" }
    });
  }

  // ADMIN → use managed company
  if (user.role === "ADMIN") {
    if (!user.managedCompany)
      throw new Error("Admin has no workspace.");

    return prisma.product.findMany({
      where: { companyId: user.managedCompany.id },
      orderBy: { createdAt: "desc" }
    });
  }

  // VISITOR → use companyId
  if (user.role === "VISITOR") {
    if (!user.companyId)
      throw new Error("Staff not assigned to workspace.");

    return prisma.product.findMany({
      where: { companyId: user.companyId },
      orderBy: { createdAt: "desc" }
    });
  }

  throw new Error("User role not allowed for inventory access.");
},

// Fetch staff of the current user's workspace
async getWorkspaceStaff(userId: string) {

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { managedCompany: true }
  });

  if (!user) throw new Error("User not found");

  // SUPERADMIN → see all VISITOR users
  if (user.role === "SUPERADMIN") {
    return prisma.user.findMany({
      where: { role: "VISITOR" },
      select: {
        id: true,
        email: true,
        isActive: true,
        isVerified: true,
        createdAt: true,
        companyId: true,
        company: true,
        managedCompany: true
      },
      orderBy: { createdAt: "desc" }
    });
  }

  // ADMIN → see only staff in their workspace
  if (user.role === "ADMIN") {
    if (!user.managedCompany)
      throw new Error("Admin has no workspace.");

    return prisma.user.findMany({
      where: {
        role: "VISITOR",
        companyId: user.managedCompany.id
      },
      select: {
        id: true,
        email: true,
        isActive: true,
        isVerified: true,
        createdAt: true,
        company: true
      },
      orderBy: { createdAt: "desc" }
    });
  }

  throw new Error("Access denied.");
},

async updateProduct(adminId: string, productId: string, data: any) {

  const admin = await prisma.user.findUnique({
    where: { id: adminId },
    include: { managedCompany: true }
  });

  if (!admin?.managedCompany)
    throw new Error("Workspace not found.");

  const product = await prisma.product.findUnique({
    where: { id: productId }
  });

  if (!product || product.companyId !== admin.managedCompany.id)
    throw new Error("Unauthorized to update this product.");

  return prisma.product.update({
    where: { id: productId },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.price && { price: parseFloat(data.price) }),
      ...(data.category && { category: data.category }),
      ...(data.stock !== undefined && { stock: parseInt(data.stock) })
    }
  });
},

async deleteProduct(adminId: string, productId: string) {

  const admin = await prisma.user.findUnique({
    where: { id: adminId },
    include: { managedCompany: true }
  });

  if (!admin?.managedCompany)
    throw new Error("Workspace not found.");

  const product = await prisma.product.findUnique({
    where: { id: productId }
  });

  if (!product || product.companyId !== admin.managedCompany.id)
    throw new Error("Unauthorized to delete this product.");

  return prisma.product.delete({
    where: { id: productId }
  });
},

async updateStaff(adminId: string, staffId: string, data: any) {

  const admin = await prisma.user.findUnique({
    where: { id: adminId },
    include: { managedCompany: true }
  });

  if (!admin?.managedCompany)
    throw new Error("Workspace not found.");

  const staff = await prisma.user.findUnique({
    where: { id: staffId }
  });

  if (!staff || staff.companyId !== admin.managedCompany.id)
    throw new Error("Unauthorized to update this staff.");

  const updateData: any = {};

  if (data.email) updateData.email = data.email;
  if (data.isActive !== undefined) updateData.isActive = data.isActive;
  if (data.isVerified !== undefined) updateData.isVerified = data.isVerified;

  if (data.password) {
    updateData.password = await bcrypt.hash(data.password, 10);
  }

  return prisma.user.update({
    where: { id: staffId },
    data: updateData
  });
},


async deleteStaff(adminId: string, staffId: string) {

  const admin = await prisma.user.findUnique({
    where: { id: adminId },
    include: { managedCompany: true }
  });

  if (!admin?.managedCompany)
    throw new Error("Workspace not found.");

  const staff = await prisma.user.findUnique({
    where: { id: staffId }
  });

  if (!staff || staff.companyId !== admin.managedCompany.id)
    throw new Error("Unauthorized to delete this staff.");

  return prisma.user.delete({
    where: { id: staffId }
  });
}


};