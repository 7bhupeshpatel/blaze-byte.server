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
