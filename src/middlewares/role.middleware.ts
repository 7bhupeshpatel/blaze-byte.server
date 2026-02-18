import { Request, Response, NextFunction } from 'express';

export const authorize = (roles: string[]) => {
    return (req: any, res: Response, next: NextFunction): void => {
        if (!req.user || !roles.includes(req.user.role)) {
                res.status(403).json({ 
                success: false, 
                message: "Access Denied: High clearance required." 
                
            });
            return;
        }
        next();
    };
    
};