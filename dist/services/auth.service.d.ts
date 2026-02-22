export declare const registerUser: (data: any) => Promise<{
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
    metadata: import("@prisma/client/runtime/library").JsonValue | null;
    updatedAt: Date;
}>;
export declare const verifyAndActivate: (email: string, otp: string) => Promise<{
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
    metadata: import("@prisma/client/runtime/library").JsonValue | null;
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
export declare const requestPasswordReset: (email: string) => Promise<boolean>;
export declare const resetPassword: (data: any) => Promise<boolean>;
//# sourceMappingURL=auth.service.d.ts.map