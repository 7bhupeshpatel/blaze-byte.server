// src/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// src/middlewares/auth.middleware.ts
export const authorize = (roles: string[]) => {
  return (req: any, res: Response, next: NextFunction): void => { // Added : void
    const user = req.user; 
    
    if (!user || !roles.includes(user.role)) {
      res.status(403).json({ message: "Access Denied" });
      return; // Ensure we exit here
    }

    if (!user.isActive || (user.isValidTill && new Date() > user.isValidTill)) {
      res.status(403).json({ message: "Account suspended or expired" });
      return; // Ensure we exit here
    }

    next(); // Valid path
  };
};