export declare const inventoryService: {
    addInventory(companyId: string, data: any): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        companyId: string;
        updatedAt: Date;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        category: string | null;
        cost: number;
        quantity: number;
        unit: string;
        supplier: string | null;
        purchaseDate: Date;
    }>;
    getInventory(companyId: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        companyId: string;
        updatedAt: Date;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        category: string | null;
        cost: number;
        quantity: number;
        unit: string;
        supplier: string | null;
        purchaseDate: Date;
    }[]>;
};
//# sourceMappingURL=inventory.service.d.ts.map