import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { date } from 'zod';

interface JwtPayload {
  id: string;
  role: string;
  isActive: boolean;
  isValidTill?: Date;
}

/**
 * VERIFY TOKEN: Extracts and validates the JWT from the Authorization header
 */
export const verifyToken = (req: any, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, message: "No token provided, authorization denied" });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    
    // Attach user payload to the request
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Token is not valid" });
    return;
  }
};

/**
 * AUTHORIZE: Checks if the user role matches and if the account is active
 */
export const authorize = (roles: string[]) => {
  return (req: any, res: Response, next: NextFunction): void => {
    const user = req.user; 
    
    console.log("Required Roles:", roles);
    console.log("User Role:", req.user?.role);
    // 1. Check if user exists (from verifyToken) and has required role
    if (!user || !roles.includes(user.role)) {
      res.status(403).json({ success: false, message: "Access Denied: Insufficient permissions" });
      return;
    }

    // 2. Check if account is active
    if (user.isActive === false) {
      res.status(403).json({ success: false, message: "Account suspended. Contact administrator." });
      return;
    }

    // 3. Optional: Check expiration of account access (isValidTill)
    if (user.isValidTill && new Date() > new Date(user.isValidTill)) {
      res.status(403).json({ success: false, message: "Account access has expired" });
      return;
    }

    next();
  };
};