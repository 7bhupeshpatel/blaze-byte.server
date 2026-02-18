import { Response, NextFunction } from 'express';
export declare const verifyToken: (req: any, res: Response, next: NextFunction) => void;
export declare const authorize: (roles: string[]) => (req: any, res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.middleware.d.ts.map