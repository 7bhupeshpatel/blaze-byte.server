export declare const registerUser: (data: any) => Promise<{
    id: string;
    email: string;
    password: string;
    role: import(".prisma/client").$Enums.Role;
    isActive: boolean;
    isVerified: boolean;
    isValidTill: Date | null;
    otp: string | null;
    otpExpires: Date | null;
    metadata: import("@prisma/client/runtime/client").JsonValue | null;
    createdAt: Date;
    updatedAt: Date;
}>;
export declare const verifyAndActivate: (email: string, otp: string) => Promise<{
    id: string;
    email: string;
    password: string;
    role: import(".prisma/client").$Enums.Role;
    isActive: boolean;
    isVerified: boolean;
    isValidTill: Date | null;
    otp: string | null;
    otpExpires: Date | null;
    metadata: import("@prisma/client/runtime/client").JsonValue | null;
    createdAt: Date;
    updatedAt: Date;
}>;
export declare const loginUser: (data: any) => Promise<{
    token: string;
    user: {
        id: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
    };
}>;
//# sourceMappingURL=auth.service.d.ts.map