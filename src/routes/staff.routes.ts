import { Router } from 'express';
import {
  getProductsForStaff,
  createSale,
  getMySales,
  updatePaymentStatus
} from '../controllers/staff.controller';
import { verifyToken, authorize } from '../middlewares/auth.middleware';

const router = Router();

router.use(verifyToken);

/* STAFF ONLY ROUTES */

router.get(
  '/products',
  authorize(['VISITOR']),
  getProductsForStaff
);

router.post(
  '/sale',
  authorize(['VISITOR']),
  createSale
);

router.get(
  '/sales',
  authorize(['VISITOR']),
  getMySales
);

router.patch(
  '/sale/:id/payment-status',
  authorize(['VISITOR']),
  updatePaymentStatus
);

export default router;
