import { Request, Response } from 'express';
export declare const fetchAllUsers: (req: Request, res: Response) => Promise<void>;
export declare const modifyUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const bulkDelete: (req: Request, res: Response) => Promise<void>;
export declare const fetchStats: (req: Request, res: Response) => Promise<void>;
export declare const fetchAuditLogs: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=admin.controller.d.ts.map