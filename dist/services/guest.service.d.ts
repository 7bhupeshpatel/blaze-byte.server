import { PaymentMethod } from '@prisma/client';
interface OrderItemInput {
    productId: string;
    quantity: number;
}
export declare class GuestService {
    static getOrderStatus(orderId: string): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.OrderStatus;
    }>;
    static getMenu(companyId: string): Promise<{
        name: string;
        id: string;
        products: {
            name: string;
            id: string;
            price: number;
            category: string | null;
            stock: number | null;
        }[];
    }>;
    static placeOrder(companyId: string, items: OrderItemInput[], customerName: string, paymentMethod: PaymentMethod, customerPhone?: string, guestId?: string): Promise<{
        items: ({
            product: {
                name: string;
                id: string;
                createdAt: Date;
                companyId: string;
                updatedAt: Date;
                price: number;
                category: string | null;
                stock: number | null;
                cost: number;
            };
        } & {
            id: string;
            quantity: number;
            productId: string;
            saleId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        companyId: string;
        staffId: string | null;
        guestId: string | null;
        status: import(".prisma/client").$Enums.OrderStatus;
        orderNumber: string | null;
        paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
        paymentUpdateCount: number;
        totalAmount: number;
        subtotalAmount: number;
        discountPercent: number | null;
        discountAmount: number | null;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        customerName: string | null;
        customerPhone: string | null;
    }>;
}
export {};
//# sourceMappingURL=guest.service.d.ts.map