import { Request, Response } from 'express';
export declare const handleAddStaff: (req: Request, res: Response) => Promise<void>;
export declare const handleAddProduct: (req: Request, res: Response) => Promise<void>;
export declare const fetchInventory: (req: Request, res: Response) => Promise<void>;
export declare const fetchStaff: (req: any, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateProduct: (req: any, res: Response) => Promise<void>;
export declare const deleteProduct: (req: any, res: Response) => Promise<void>;
export declare const updateStaff: (req: any, res: Response) => Promise<void>;
export declare const deleteStaff: (req: any, res: Response) => Promise<void>;
//# sourceMappingURL=workspace.controller.d.ts.map