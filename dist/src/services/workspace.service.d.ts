export declare const workspaceService: {
    addStaff(adminId: string, staffData: any): Promise<{
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
    addProduct(adminId: string, productData: any): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        companyId: string;
        updatedAt: Date;
        price: number;
        category: string | null;
        stock: number | null;
    }>;
    getWorkspaceInventory(userId: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        companyId: string;
        updatedAt: Date;
        price: number;
        category: string | null;
        stock: number | null;
    }[]>;
    getWorkspaceStaff(userId: string): Promise<{
        id: string;
        createdAt: Date;
        email: string;
        isActive: boolean;
        isVerified: boolean;
        company: {
            name: string;
            id: string;
            createdAt: Date;
            ownerId: string;
        } | null;
    }[]>;
    updateProduct(adminId: string, productId: string, data: any): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        companyId: string;
        updatedAt: Date;
        price: number;
        category: string | null;
        stock: number | null;
    }>;
    deleteProduct(adminId: string, productId: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        companyId: string;
        updatedAt: Date;
        price: number;
        category: string | null;
        stock: number | null;
    }>;
    updateStaff(adminId: string, staffId: string, data: any): Promise<{
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
    deleteStaff(adminId: string, staffId: string): Promise<{
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
};
//# sourceMappingURL=workspace.service.d.ts.map