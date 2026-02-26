import { Router } from 'express';
import * as order from '../controllers/order.controller';
import { verifyToken } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';

const router = Router();

router.use(verifyToken);

// ✅ Get all orders (optional ?status=CONFIRMED)
router.get(
  '/',
  authorize(['ADMIN', 'SUPERADMIN', 'VISITOR']),
  order.getOrders
);

// ✅ Confirm
router.patch(
  '/:saleId/confirm',
  authorize(['ADMIN', 'SUPERADMIN', 'VISITOR']),
  order.confirmOrder
);

// ✅ Update Status
router.patch(
  '/:saleId/status',
  authorize(['ADMIN', 'SUPERADMIN', 'VISITOR']),
  order.updateOrderStatus
);

export default router;