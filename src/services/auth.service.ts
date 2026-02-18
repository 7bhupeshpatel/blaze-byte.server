import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/db.config';
import { Role } from '@prisma/client';
import { sendEmail } from '../utils/emai.util';

export const registerUser = async (data: any) => {
  const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
  if (existingUser) throw new Error("User already exists");

  const hashedPassword = await bcrypt.hash(data.password, 12);
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      otp,
      otpExpires,
      role: Role.GUEST, // Default role until SuperAdmin approves
      metadata: data.metadata || {},
    },
  });

  await sendEmail(data.email, "Verify your Account", `Your OTP is: ${otp}`);
  return user;
};

export const verifyAndActivate = async (email: string, otp: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || user.otp !== otp || (user.otpExpires && user.otpExpires < new Date())) {
    throw new Error("Invalid or expired OTP");
  }

  return await prisma.user.update({
    where: { email },
    data: { isVerified: true, otp: null, otpExpires: null },
  });
};

export const loginUser = async (data: any) => {
  const user = await prisma.user.findUnique({ where: { email: data.email } });
  if (!user || !user.isVerified) throw new Error("Invalid credentials or unverified account");

  const isMatch = await bcrypt.compare(data.password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  if (!user.isActive) throw new Error("Account is suspended");

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET as string,
    { expiresIn: '1d' }
  );

  return { token, user: { id: user.id, email: user.email, role: user.role } };
};


// Add these to your existing auth.service.ts

export const requestPasswordReset = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("If an account exists with this email, an OTP has been sent.");

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

  await prisma.user.update({
    where: { email },
    data: { otp, otpExpires }
  });

  await sendEmail(email, "Password Reset OTP", `Your password reset code is: ${otp}`);
  return true;
};

export const resetPassword = async (data: any) => {
  const { email, otp, newPassword } = data;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || user.otp !== otp || (user.otpExpires && user.otpExpires < new Date())) {
    throw new Error("Invalid or expired OTP");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  await prisma.user.update({
    where: { email },
    data: { 
      password: hashedPassword, 
      otp: null, 
      otpExpires: null 
    }
  });

  return true;
};