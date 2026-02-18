import { Request, Response } from 'express';
import { workspaceService } from '../services/workspace.service';

export const handleAddStaff = async (req: Request, res: Response) => {
  try {
    const adminId = (req as any).user.id;
    const staff = await workspaceService.addStaff(adminId, req.body);
    res.json({ success: true, data: staff });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const handleAddProduct = async (req: Request, res: Response) => {
  try {
    const adminId = (req as any).user.id;
    const product = await workspaceService.addProduct(adminId, req.body);
    res.json({ success: true, data: product });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const fetchInventory = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const inventory = await workspaceService.getWorkspaceInventory(userId);
    res.json({ success: true, data: inventory });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const fetchStaff = async (req: any, res: Response) => {
  try {
    const staff = await workspaceService.getWorkspaceStaff(req.user.id);

    return res.json({
      success: true,
      data: staff
    });

  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const updateProduct = async (req: any, res: Response) => {
  try {
    const result = await workspaceService.updateProduct(
      req.user.id,
      req.params.id,
      req.body
    );

    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteProduct = async (req: any, res: Response) => {
  try {
    await workspaceService.deleteProduct(
      req.user.id,
      req.params.id
    );

    res.json({ success: true });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateStaff = async (req: any, res: Response) => {
  try {
    const result = await workspaceService.updateStaff(
      req.user.id,
      req.params.id,
      req.body
    );

    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteStaff = async (req: any, res: Response) => {
  try {
    await workspaceService.deleteStaff(
      req.user.id,
      req.params.id
    );

    res.json({ success: true });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

