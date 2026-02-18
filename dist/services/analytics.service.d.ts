export declare const analyticsService: {
    getAdminAnalytics(userId: string): Promise<{
        daily: number;
        weekly: number;
        monthly: number;
        mostSoldProduct: {
            name: string;
            id: string;
            createdAt: Date;
            companyId: string;
            updatedAt: Date;
            price: number;
            category: string | null;
            stock: number | null;
        } | null;
        mostSoldCategory: string | null;
    }>;
    getStaffAnalytics(userId: string): Promise<{
        daily: number;
        weekly: number;
        monthly: number;
    }>;
};
//# sourceMappingURL=analytics.service.d.ts.map