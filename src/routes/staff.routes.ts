import { Router } from 'express';
import {
  getProductsForStaff,
  createSale,
  getMySales
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

export default router;
