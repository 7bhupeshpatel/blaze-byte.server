export declare class OrderService {
    static confirmOrder(saleId: string, staffId: string): Promise<{
        id: string;
        createdAt: Date;
        companyId: string;
        staffId: string | null;
        guestId: string | null;
        status: import(".prisma/client").$Enums.OrderStatus;
        orderNumber: string | null;
        totalAmount: number;
        subtotalAmount: number;
        discountPercent: number | null;
        discountAmount: number | null;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        customerName: string | null;
        customerPhone: string | null;
    }>;
}
//# sourceMappingURL=order.service.d.ts.map