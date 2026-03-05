import { Request, Response } from 'express';
import { staffService } from '../services/staff.service';

export const getProductsForStaff = async (req: any, res: Response) => {
  try {
    const products = await staffService.getCompanyProducts(req.user.id);
    res.json({ success: true, data: products });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const createSale = async (req: any, res: Response) => {
  try {
    const sale = await staffService.createSale(
      req.user.id,
      req.body.items,
      req.body.customer,
      req.body.discountPercent,
      req.body.paymentMethod,
      req.body.paymentStatus
    );

    res.json({ success: true, data: sale });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getMySales = async (req: any, res: Response) => {
  try {
    const sales = await staffService.getMySales(req.user.id);
    res.json({ success: true, data: sales });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Add this to your staff.controller.ts file

export const updatePaymentStatus = async (req: any, res: Response) => {
  try {
    const saleId = req.params.id; // From URL: /sale/:id/payment-status
    const { paymentStatus } = req.body; // "PAID" or "PENDING"

    if (!paymentStatus || !['PAID', 'PENDING', 'FAILED'].includes(paymentStatus)) {
       res.status(400).json({ success: false, message: "Invalid payment status provided." });
    }

    const updatedSale = await staffService.updatePaymentStatus(
      req.user.id,
      saleId,
      paymentStatus
    );

    res.json({ success: true, data: updatedSale });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};
