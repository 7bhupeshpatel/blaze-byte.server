import { Request, Response } from 'express';
interface AuthRequest extends Request {
    user?: {
        id: string;
    };
}
export declare const getCompanyMenu: (req: Request, res: Response) => Promise<any>;
export declare const placeGuestOrder: (req: AuthRequest, res: Response) => Promise<any>;
export {};
//# sourceMappingURL=guest.controller.d.ts.map