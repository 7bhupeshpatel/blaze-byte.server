import { Request, Response } from 'express';
interface AuthRequest extends Request {
    user?: {
        id: string;
        companyId: string;
        role: string;
    };
}
export declare const getOrders: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const confirmOrder: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateOrderStatus: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export {};
//# sourceMappingURL=order.controller.d.ts.map