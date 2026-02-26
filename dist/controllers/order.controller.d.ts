import { Response, Request } from 'express';
interface AuthRequest extends Request {
    user?: {
        id: string;
        companyId: string;
        role: string;
    };
}
export declare const getPendingOrders: (req: AuthRequest, res: Response) => Promise<any>;
export declare const confirmOrder: (req: AuthRequest, res: Response) => Promise<any>;
export declare const updateOrderStatus: (req: AuthRequest, res: Response) => Promise<any>;
export {};
//# sourceMappingURL=order.controller.d.ts.map