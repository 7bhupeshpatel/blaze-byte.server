import { Request, Response } from 'express';
import { OrderService } from '../services/order.service';
import { OrderStatus } from '@prisma/client';

interface AuthRequest extends Request {
  user?: { id: string; companyId: string; role: string };
}

// ✅ GET /orders
export const getOrders = async (req: AuthRequest, res: Response) => {
  try {
    const companyId = req.user?.companyId;
    const status = req.query.status as OrderStatus | undefined;

    if (!companyId) {
      return res.status(401).json({
        success: false,
        message: "No company associated"
      });
    }

    const orders = await OrderService.getOrders(companyId, status);

    return res.status(200).json({
      success: true,
      data: orders
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ✅ Confirm Order
export const confirmOrder = async (req: AuthRequest, res: Response) => {
  try {
    const saleId = req.params.saleId;
    const staffId = req.user?.id;

    if (!staffId) return res.status(401).json({ message: "Unauthorized" });

    const updated = await OrderService.confirmOrder(saleId as string, staffId);

    return res.status(200).json({
      success: true,
      data: updated
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// ✅ Update Status (PREPARING, COMPLETED, CANCELLED)
export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
  try {
    const saleId = req.params.saleId;
    const { status } = req.body;

    const updated = await OrderService.updateStatus(
      saleId as string,
      status as OrderStatus
    );

    return res.status(200).json({
      success: true,
      data: updated
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};