export declare const adminService: {
    getAllUsers(search?: string): Promise<{
        id: string;
        createdAt: Date;
        email: string;
        password: string;
        role: import(".prisma/client").$Enums.Role;
        isActive: boolean;
        isVerified: boolean;
        isValidTill: Date | null;
        otp: string | null;
        otpExpires: Date | null;
        resetOtp: string | null;
        resetOtpExpires: Date | null;
        companyId: string | null;
        metadata: import("@prisma/client/runtime/client").JsonValue | null;
        updatedAt: Date;
    }[]>;
    updateUser(userId: string, data: any, adminId: string): Promise<{
        id: string;
        createdAt: Date;
        email: string;
        password: string;
        role: import(".prisma/client").$Enums.Role;
        isActive: boolean;
        isVerified: boolean;
        isValidTill: Date | null;
        otp: string | null;
        otpExpires: Date | null;
        resetOtp: string | null;
        resetOtpExpires: Date | null;
        companyId: string | null;
        metadata: import("@prisma/client/runtime/client").JsonValue | null;
        updatedAt: Date;
    }>;
    getAuditLogs(): Promise<({
        admin: {
            email: string;
        };
    } & {
        id: string;
        adminId: string;
        action: string;
        targetId: string | null;
        details: string | null;
        createdAt: Date;
    })[]>;
    deleteUsers(userIds: string[]): Promise<import(".prisma/client").Prisma.BatchPayload>;
    getStats(): Promise<{
        totalUsers: number;
        activeUsers: number;
        pendingUsers: number;
        roleDistribution: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.UserGroupByOutputType, "role"[]> & {
            _count: {
                role: number;
            };
        })[];
    }>;
};
//# sourceMappingURL=admin.service.d.ts.map