export declare const analyticsService: {
    getAdminAnalytics(userId: string): Promise<{
        daily: number;
        weekly: number;
        monthly: number;
        yearly: number;
        dailyCash: number;
        dailyOnline: number;
        monthlyCash: number;
        monthlyOnline: number;
        totalOrdersToday: number;
        totalOrdersMonth: number;
        averageOrderValue: number;
        monthlyGrowthPercent: number;
        isGrowing: boolean;
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
        categoryBreakdown: {
            category: string;
            quantity: number;
        }[];
    }>;
    getStaffAnalytics(userId: string): Promise<{
        daily: number;
        weekly: number;
        monthly: number;
        dailyCash: number;
        dailyOnline: number;
        monthlyCash: number;
        monthlyOnline: number;
    }>;
};
//# sourceMappingURL=analytics.service.d.ts.map