import { OrderStatus } from '@prisma/client';
export declare class OrderService {
    static getOrders(companyId: string, status?: OrderStatus): Promise<({
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
    })[]>;
    static confirmOrder(saleId: string, staffId: string): Promise<{
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
    static updateStatus(saleId: string, status: OrderStatus): Promise<{
        staff: {
            id: string;
            email: string;
        } | null;
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
//# sourceMappingURL=order.service.d.ts.map