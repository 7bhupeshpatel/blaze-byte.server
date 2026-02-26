export declare const staffService: {
    getCompanyProducts(userId: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        companyId: string;
        updatedAt: Date;
        price: number;
        category: string | null;
        stock: number | null;
        cost: number;
    }[]>;
    createSale(userId: string, items: {
        productId: string;
        quantity: number;
    }[], customer?: {
        name?: string;
        phone?: string;
    }, discountPercent?: number, paymentMethod?: "CASH" | "ONLINE"): Promise<{
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
        totalAmount: number;
        subtotalAmount: number;
        discountPercent: number | null;
        discountAmount: number | null;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        customerName: string | null;
        customerPhone: string | null;
    }>;
    getMySales(userId: string): Promise<({
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
        totalAmount: number;
        subtotalAmount: number;
        discountPercent: number | null;
        discountAmount: number | null;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        customerName: string | null;
        customerPhone: string | null;
    })[]>;
};
//# sourceMappingURL=staff.service.d.ts.map