import prisma from '../config/db.config';

export const staffService = {

  /* ========================== */
  /* ===== GET PRODUCTS ======= */
  /* ========================== */

  async getCompanyProducts(userId: string) {
    const staff = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!staff || !staff.companyId)
      throw new Error("Staff not assigned to any company.");

    return prisma.product.findMany({
      where: { companyId: staff.companyId },
      orderBy: { createdAt: "desc" }
    });
  },

  /* ========================== */
  /* ===== CREATE SALE ======== */
  /* ========================== */

async createSale(
  userId: string,
  items: { productId: string; quantity: number }[],
  customer?: { name?: string; phone?: string },
  discountPercent?: number,
  paymentMethod?: "CASH" | "ONLINE",
  paymentStatus: "PAID" | "PENDING" = "PAID"
) {

  const staff = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!staff || !staff.companyId)
    throw new Error("Unauthorized.");

  const companyId = staff.companyId as string;
  let subtotalAmount = 0;

  const products = await prisma.product.findMany({
    where: {
      id: { in: items.map(i => i.productId) }
    }
  });

  for (const item of items) {
    const product = products.find(p => p.id === item.productId);
    if (!product)
      throw new Error("Invalid product.");

    if (product.companyId !== staff.companyId)
      throw new Error("Invalid company product.");

    if ((product.stock || 0) < item.quantity)
      throw new Error(`Insufficient stock for ${product.name}`);

    subtotalAmount += product.price * item.quantity;
  }

  const discount = discountPercent || 0;
  const discountAmount = (subtotalAmount * discount) / 100;
  const totalAmount = subtotalAmount - discountAmount;
  const method = paymentMethod || "CASH";

if (!["CASH", "ONLINE"].includes(method)) {
  throw new Error("Invalid payment method.");
}

  return prisma.$transaction(async (tx) => {

    const sale = await tx.sale.create({
      data: {
        staffId: userId,
        companyId: companyId,
        subtotalAmount,
        discountPercent: discount,
        discountAmount,
        totalAmount,
        customerName: customer?.name || null,
        customerPhone: customer?.phone || null,
        paymentMethod: method,   // ✅ NEW FIELD
        paymentStatus: paymentStatus, // ✅ NEW FIELD
        items: {
        create: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        }))
      }
      
      },
      include: {
        staff: { select: { id: true, email: true } },
        items: { include: { product: true } }
      }
    });

    for (const item of items) {

      await tx.product.update({
        where: { id: item.productId },
        data: {
          stock: { decrement: item.quantity }
        }
      });
    }

    return sale;
  });
}
,

  /* ========================== */
  /* ===== GET MY SALES ======= */
  /* ========================== */

  async getMySales(userId: string) {

return prisma.sale.findMany({
  where: { staffId: userId },
  include: {
    staff: {
      select: {
        id: true,
        email: true
      }
    },
    items: {
      include: {
        product: true
      }
    }
  },
  orderBy: { createdAt: "desc" }
});

  },

  // Add this inside your exported staffService object

  /* ================================== */
  /* ===== UPDATE PAYMENT STATUS ====== */
  /* ================================== */

  async updatePaymentStatus(userId: string, saleId: string, newStatus: "PAID" | "PENDING" | "FAILED") {
    // 1. Verify staff exists and belongs to a company
    const staff = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!staff || !staff.companyId) {
      throw new Error("Unauthorized.");
    }

    // 2. Fetch the sale
    const sale = await prisma.sale.findUnique({
      where: { id: saleId }
    });

    if (!sale) {
      throw new Error("Sale not found.");
    }

    // 3. Ensure staff belongs to the same company as the order
    if (sale.companyId !== staff.companyId) {
      throw new Error("Unauthorized to modify this order.");
    }

    // 4. Prevent unnecessary updates if the status is the same
    if (sale.paymentStatus === newStatus) {
      throw new Error(`Payment status is already ${newStatus}.`);
    }

    // 5. Enforce the maximum of 3 changes rule
    if (sale.paymentUpdateCount >= 3) {
      throw new Error("Maximum of 3 payment status changes allowed per order.");
    }

    // 6. Update the status and increment the counter
    return prisma.sale.update({
      where: { id: saleId },
      data: {
        paymentStatus: newStatus,
        paymentUpdateCount: { increment: 1 } // ✅ Increment the counter
      },
      include: {
        staff: { select: { id: true, email: true } },
        items: { include: { product: true } }
      }
    });
  }

  

};
