import { PaymentMethod } from '@prisma/client';
import prisma from '../config/db.config';

// 1. Define an interface instead of using 'any' to catch typos early
export interface AddInventoryDTO {
  name: string;
  category: string;
  quantity: string | number;
  unit: string;
  cost: string | number;
  supplier?: string;
  paymentMethod: PaymentMethod ;
  purchaseDate?: string | Date;
}

export const inventoryService = {
  async addInventory(companyId: string, data: AddInventoryDTO) {
    try {
      // 2. Explicitly block requests missing a companyId
      if (!companyId) {
        throw new Error('Workspace/Company ID is required to add inventory.');
      }

      // 3. Safeguard the numbers so they don't become NaN
      const quantity = typeof data.quantity === 'string' ? parseFloat(data.quantity) : data.quantity;
      const cost = typeof data.cost === 'string' ? parseFloat(data.cost) : data.cost;

      if (isNaN(quantity) || isNaN(cost)) {
        throw new Error('Quantity and cost must be valid numbers.');
      }

      return await prisma.inventory.create({
        data: {
          name: data.name,
          category: data.category,
          quantity,
          unit: data.unit,
          cost,
          supplier: data.supplier ?? null,
          paymentMethod: data.paymentMethod,
          purchaseDate: data.purchaseDate ? new Date(data.purchaseDate) : new Date(),
          companyId: companyId
        }
      });
    } catch (error: any) {
      console.error('InventoryService:addInventory Error →', error);
      // Pass the specific error message up to the controller
      throw new Error(error.message || 'Failed to add inventory item');
    }
  },

  async getInventory(companyId: string) {
    try {
      if (!companyId) {
        throw new Error('Workspace/Company ID is required to fetch inventory.');
      }

      return await prisma.inventory.findMany({
        where: { companyId },
        orderBy: { purchaseDate: 'desc' }
      });
    } catch (error: any) {
      console.error('InventoryService:getInventory Error →', error);
      throw new Error(error.message || 'Failed to fetch inventory');
    }
  }
};