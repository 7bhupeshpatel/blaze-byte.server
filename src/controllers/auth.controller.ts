import { Request, Response, NextFunction } from 'express';
import * as AuthService from '../services/auth.service';

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await AuthService.registerUser(req.body);
    res.status(201).json({ 
      success: true, 
      message: "Registration successful. Please check your email for OTP." 
    });
  } catch (error) {
    next(error); // Sends error to your Global Error Handler
  }
};

export const verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, otp } = req.body;
    await AuthService.verifyAndActivate(email, otp);
    res.status(200).json({ 
      success: true, 
      message: "Account verified. Waiting for Admin approval to access dashboard." 
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AuthService.loginUser(req.body);
    res.status(200).json({ 
      success: true, 
      ...result 
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response) => {
  // On client side, delete the JWT token from localStorage/cookies
  res.status(200).json({ success: true, message: "Logged out successfully" });
};