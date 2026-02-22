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
        };
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
        staffId: string;
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
        };
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
        staffId: string;
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