import { Request, Response } from 'express';
import { GuestService } from '../services/guest.service';

// 1. Create a custom interface extending Express's Request to include 'user'
interface AuthRequest extends Request {
  user?: {
    id: string;
    // Add any other properties your JWT payload contains (e.g., role: string)
  };
}

export const getCompanyMenu = async (req: Request, res: Response): Promise<any> => {
  try {
    // 2. Explicitly cast companyId as a string to satisfy TypeScript
    const companyId = req.params.companyId as string;
    
    const menuData = await GuestService.getMenu(companyId);
    
    return res.status(200).json({ success: true, data: menuData });
  } catch (error: any) {
    return res.status(404).json({ success: false, message: error.message });
  }
};

export const getOrderStatus = async (req: Request, res: Response) => {
  try {
    const orderId = req.params.orderId as string;

    const order = await GuestService.getOrderStatus(orderId);

    return res.status(200).json({
      success: true,
      data: order
    });

  } catch (error: any) {
    return res.status(404).json({
      success: false,
      message: error.message
    });
  }
};
export const placeGuestOrder = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    // Explicitly cast companyId as a string
    const companyId = req.params.companyId as string;
    const { items, customerName, customerPhone } = req.body;
    
    // 3. TypeScript now knows 'user' might exist on this AuthRequest
    const guestId = req.user?.id; 

    // Basic Validation
    if (!customerName || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: "Missing required fields or empty cart" });
    }

    const order = await GuestService.placeOrder(
      companyId, 
      items, 
      customerName, 
      customerPhone,
      guestId
    );
    
    return res.status(201).json({ 
      success: true, 
      message: "Order placed successfully. Awaiting confirmation.", 
      data: order 
    });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }

  
};