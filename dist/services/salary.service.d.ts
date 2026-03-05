export declare const salaryService: {
    recordSalary(companyId: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        companyId: string;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.PaymentStatus;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        amount: number;
        month: number;
        year: number;
        paymentDate: Date;
        notes: string | null;
        userId: string;
    }>;
    getCompanySalaries(companyId: string): Promise<({
        user: {
            id: string;
            email: string;
            metadata: import("@prisma/client/runtime/library").JsonValue;
        };
    } & {
        id: string;
        createdAt: Date;
        companyId: string;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.PaymentStatus;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        amount: number;
        month: number;
        year: number;
        paymentDate: Date;
        notes: string | null;
        userId: string;
    })[]>;
};
//# sourceMappingURL=salary.service.d.ts.map