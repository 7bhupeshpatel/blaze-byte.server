import prisma from '../config/db.config';

export const analyticsService = {

  async getAdminAnalytics(userId: string) {

    const admin = await prisma.user.findUnique({
      where: { id: userId },
      include: { managedCompany: true }
    });

    if (!admin?.managedCompany)
      throw new Error("Workspace not found");

    const companyId = admin.managedCompany.id;

    const now = new Date();

    const startOfDay = new Date(now);
    startOfDay.setHours(0,0,0,0);

    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0,0,0,0);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    /* ============================= */
    /* ===== SALES TOTALS ========== */
    /* ============================= */

    const [daily, weekly, monthly] = await Promise.all([

      prisma.sale.aggregate({
        _sum: { totalAmount: true },
        where: {
          createdAt: { gte: startOfDay },
          staff: { companyId }
        }
      }),

      prisma.sale.aggregate({
        _sum: { totalAmount: true },
        where: {
          createdAt: { gte: startOfWeek },
          staff: { companyId }
        }
      }),

      prisma.sale.aggregate({
        _sum: { totalAmount: true },
        where: {
          createdAt: { gte: startOfMonth },
          staff: { companyId }
        }
      })

    ]);

    /* ============================= */
    /* ===== MOST SOLD PRODUCT ===== */
    /* ============================= */

    const topProduct = await prisma.saleItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 1
    });

    let productInfo = null;

    if (topProduct.length > 0) {
      productInfo = await prisma.product.findUnique({
        where: { id: topProduct[0].productId }
      });
    }

    /* ============================= */
    /* ===== MOST SOLD CATEGORY ==== */
    /* ============================= */

    const categoryData = await prisma.saleItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true }
    });

    let categoryMap: Record<string, number> = {};

    for (const entry of categoryData) {
      const product = await prisma.product.findUnique({
        where: { id: entry.productId }
      });

      if (!product) continue;

      const category = product.category || "General";

      categoryMap[category] =
        (categoryMap[category] || 0) + (entry._sum.quantity || 0);
    }

    const mostSoldCategory = Object.entries(categoryMap)
      .sort((a, b) => b[1] - a[1])[0];

    return {
      daily: daily._sum.totalAmount || 0,
      weekly: weekly._sum.totalAmount || 0,
      monthly: monthly._sum.totalAmount || 0,

      mostSoldProduct: productInfo,
      mostSoldCategory: mostSoldCategory?.[0] || null
    };
  },


  async getStaffAnalytics(userId: string) {

    const now = new Date();

    const startOfDay = new Date(now);
    startOfDay.setHours(0,0,0,0);

    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0,0,0,0);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [daily, weekly, monthly] = await Promise.all([

      prisma.sale.aggregate({
        _sum: { totalAmount: true },
        where: {
          staffId: userId,
          createdAt: { gte: startOfDay }
        }
      }),

      prisma.sale.aggregate({
        _sum: { totalAmount: true },
        where: {
          staffId: userId,
          createdAt: { gte: startOfWeek }
        }
      }),

      prisma.sale.aggregate({
        _sum: { totalAmount: true },
        where: {
          staffId: userId,
          createdAt: { gte: startOfMonth }
        }
      })

    ]);

    return {
      daily: daily._sum.totalAmount || 0,
      weekly: weekly._sum.totalAmount || 0,
      monthly: monthly._sum.totalAmount || 0
    };
  }

};
