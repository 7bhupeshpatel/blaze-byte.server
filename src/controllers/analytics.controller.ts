import { Response } from 'express';
import { analyticsService } from '../services/analytics.service';

export const getAdminAnalytics = async (req: any, res: Response) => {
  try {
    const data = await analyticsService.getAdminAnalytics(req.user.id);
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const getStaffAnalytics = async (req: any, res: Response) => {
  try {
    const data = await analyticsService.getStaffAnalytics(req.user.id);
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};
