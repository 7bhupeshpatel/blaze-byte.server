import { Request, Response } from 'express';
import { inventoryService } from '../services/inventory.service';
import prisma from '../config/db.config';

export const addInventory = async (req: any, res: Response) => {
  try {
    // 1. Try to get the company ID from the token first
    let companyId = req.user.role === 'ADMIN' 
      ? req.user.managedCompany?.id 
      : req.user.companyId;

    // 2. FALLBACK: If the token is missing the ID, fetch fresh data from the DB
    if (!companyId) {
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        include: { managedCompany: true }
      });
      
      if (user) {
        companyId = user.role === 'ADMIN' ? user.managedCompany?.id : user.companyId;
      }
    }

    // 3. Final Check
    if (!companyId) {
      return res.status(400).json({ 
        success: false, 
        message: "No workspace found. Please log out and back in to refresh your session." 
      });
    }

    // 4. Proceed with adding inventory
    const item = await inventoryService.addInventory(companyId, req.body);
    
    res.status(201).json({ 
      success: true, 
      data: item 
    });

  } catch (error: any) {
    console.error("Controller Error: addInventory ->", error);
    res.status(500).json({ 
      success: false, 
      message: error.message || "An internal error occurred while adding inventory." 
    });
  }
};

export const fetchInventory = async (req: any, res: Response) => {
  try {
    let companyId = req.user.role === 'ADMIN' ? req.user.managedCompany?.id : req.user.companyId;

    // FALLBACK: If the token is stale, fetch fresh from DB
    if (!companyId) {
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        include: { managedCompany: true }
      });
      
      companyId = user?.role === 'ADMIN' ? user?.managedCompany?.id : user?.companyId;
    }

    if (!companyId) {
      return res.status(400).json({ 
        success: false, 
        message: "No workspace found. Please ensure your admin has set up your workspace." 
      });
    }

    const inventory = await inventoryService.getInventory(companyId);
    return res.json({ success: true, data: inventory });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};