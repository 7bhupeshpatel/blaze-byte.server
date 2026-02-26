import { Request, Response, NextFunction } from 'express';

export const authorize = (roles: string[]) => {
    return (req: any, res: Response, next: NextFunction): void => {
        console.log("User Role from Token:", req.user.role);
    console.log("Required Roles:", roles);
        if (!req.user || !roles.includes(req.user.role)) {
            console.log("❌ Role Mismatch!");
                res.status(403).json({ 
                success: false, 
                message: "Access Denied: High clearance required." 
                
            });
            return;
        }
        next();
    };
    
};