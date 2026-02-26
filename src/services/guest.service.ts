import { PrismaClient, OrderStatus, PaymentMethod } from '@prisma/client';

const prisma = new PrismaClient();

interface OrderItemInput {
  productId: string;
  quantity: number;
}

export class GuestService {

    static async getOrderStatus(orderId: string) {
    const order = await prisma.sale.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        status: true
      }
    });

    if (!order) {
      throw new Error("Order not found");
    }

    return order;
};
  
  // 1. Fetch the public menu for a company
  static async getMenu(companyId: string) {
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      select: {
        id: true,
        name: true,
        products: {
          where: { stock: { gt: 0 } }, // Only show items in stock
          select: { id: true, name: true, price: true, category: true, stock: true }
        }
      }
    });

    if (!company) throw new Error("Company not found");
    return company;
  }

  // 2. Place an order as a guest
  static async placeOrder(
    companyId: string, 
    items: OrderItemInput[], 
    customerName: string, 
    customerPhone?: string,
    guestId?: string
  ) {
    if (!items || items.length === 0) throw new Error("Cart is empty");

    // Fetch actual prices from the database for security
    const productIds = items.map(i => i.productId);
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds }, companyId }
    });

    if (dbProducts.length !== items.length) {
      throw new Error("Invalid products in cart.");
    }

    let subtotal = 0;
    const saleItemsData = items.map(item => {
      const product = dbProducts.find(p => p.id === item.productId)!;
      
      // Stock check validation
      if (product.stock !== null && product.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name}`);
      }

      subtotal += product.price * item.quantity;
      return { productId: item.productId, quantity: item.quantity };
    });

    // Generate a short 4-digit order number for the guest to track
    const orderNumber = Math.floor(1000 + Math.random() * 9000).toString();

    // Create the Sale as PENDING. Stock is NOT deducted yet.
    // Stock is only deducted when Staff moves it to CONFIRMED.
    const sale = await prisma.sale.create({
      data: {
        companyId,
        guestId: guestId ?? null,
        status: OrderStatus.PENDING,
        orderNumber,
        subtotalAmount: subtotal,
        totalAmount: subtotal, // Assuming no discounts for guest orders initially
        paymentMethod: PaymentMethod.ONLINE, // Adjust as needed
        customerName,
        customerPhone: customerPhone ?? null,
        items: {
          create: saleItemsData
        }
      },
      include: { items: { include: { product: true } } }
    });

    return sale;
  }

 

}