import { Router } from 'express';
import * as inventoryController from '../controllers/inventory.controller';
import { verifyToken } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';

const router = Router();

router.use(verifyToken);

// Both Staff and Admin might need to add/view inventory
router.post('/', authorize(['ADMIN', 'SUPERADMIN', 'VISITOR']), inventoryController.addInventory);
router.get('/', authorize(['ADMIN', 'SUPERADMIN', 'VISITOR']), inventoryController.fetchInventory);

export default router;