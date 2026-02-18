import { Request, Response } from 'express';
import { adminService } from '../services/admin.service';

export const fetchAllUsers = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    const users = await adminService.getAllUsers(search as string);
    res.json({ success: true, data: users });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const modifyUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const adminId = (req as any).user.id;

    // Prevent Super Admin from deactivating themselves
    if (id === adminId && req.body.isActive === false) {
        res.status(400).json({ 
        success: false, 
        message: "You cannot deactivate your own administrative account." 
      });
    }

    const updatedUser = await adminService.updateUser(id, req.body, adminId);
    return res.json({ success: true, message: "User updated successfully", data: updatedUser });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const bulkDelete = async (req: Request, res: Response) => {
  try {
    const { ids } = req.body; // Expecting an array of strings
    await adminService.deleteUsers(ids);
    res.json({ success: true, message: "Users purged successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const fetchStats = async (req: Request, res: Response) => {
  try {
    const stats = await adminService.getStats();
    res.json({ success: true, data: stats });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }

};

export const fetchAuditLogs = async (req: Request, res: Response) => {
  try {
    const logs = await adminService.getAuditLogs();
    res.json({ success: true, data: logs });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};