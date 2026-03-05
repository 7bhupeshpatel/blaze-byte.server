import { PrismaClient, OrderStatus } from '@prisma/client';

const prisma = new PrismaClient();

export class OrderService {

  // ✅ Get all orders for company (optional status filter)
  static async getOrders(companyId: string, status?: OrderStatus) {
    return prisma.sale.findMany({
      where: {
        companyId,
        ...(status ? { status } : {})
      },
      include: {
        items: {
          include: { product: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  // ✅ Confirm Order
  static async confirmOrder(saleId: string, staffId: string) {
    const sale = await prisma.sale.findUnique({
      where: { id: saleId },
      include: { items: true }
    });

    if (!sale) throw new Error("Order not found");
    if (sale.status !== OrderStatus.PENDING)
      throw new Error("Order is not pending");

    return prisma.$transaction(async (tx) => {
      for (const item of sale.items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId }
        });

        if (!product || (product.stock !== null && product.stock < item.quantity)) {
          throw new Error(`Insufficient stock for product ${item.productId}`);
        }

        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } }
        });
      }

      return tx.sale.update({
        where: { id: saleId },
        data: {
          status: OrderStatus.CONFIRMED,
          staffId,
          // If a guest hasn't paid online yet, ensure status is PENDING
          paymentStatus: sale.paymentMethod === 'ONLINE' ? 'PAID' : 'PENDING'
        },
        include: {
          items: { include: { product: true } }
        }
      });
    });
  }

static async updateStatus(saleId: string, status: OrderStatus) {
  return prisma.$transaction(async (tx) => {

    const sale = await tx.sale.findUnique({
      where: { id: saleId },
      include: { items: true }
    });

    if (!sale) throw new Error("Order not found");

    // 🔥 FINALIZATION LOGIC
    if (status === OrderStatus.COMPLETED) {

      if (sale.status !== OrderStatus.PREPARING) {
        throw new Error("Only PREPARING orders can be completed");
      }

      // Optional: mark payment confirmed if ONLINE
      // If you have paymentStatus column, update here

      // Optional: create ledger entry if you maintain revenue table
      // await tx.revenue.create({...});
    }

    return tx.sale.update({
      where: { id: saleId },
      data: { status },
      include: {
        staff: { select: { id: true, email: true } },
        items: { include: { product: true } }
      }
    });
  });
}


}