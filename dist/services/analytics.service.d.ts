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
        totalOrdersYear: number;
        totalDiscountMonth: number;
        totalDiscountYear: number;
        averageOrderValue: number;
        monthlyGrowthPercent: number;
        isGrowing: boolean;
        last7Days: {
            date: string;
            revenue: number;
        }[];
        last12Months: {
            month: string;
            revenue: number;
        }[];
        staffRanking: ({
            name: string;
            revenue: number;
        } | null)[];
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