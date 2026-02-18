import { Router } from 'express';
import * as AuthController from '../controllers/auth.controller';

const router = Router();

// Public routes
router.post('/signup', AuthController.signup);
router.post('/verify-otp', AuthController.verifyOtp);
router.post('/login', AuthController.login);
router.post('/forgot-password', AuthController.forgotPasswordRequest);
router.post('/reset-password', AuthController.resetPasswordConfirm);

// Protected routes (User must be logged in)
router.post('/logout', AuthController.logout);

export default router;