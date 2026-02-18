import { Router } from 'express';
import { verifyToken, authorize } from '../middlewares/auth.middleware';
import {
  getAdminAnalytics,
  getStaffAnalytics
} from '../controllers/analytics.controller';

const router = Router();

router.use(verifyToken);

router.get(
  '/admin',
  authorize(['ADMIN']),
  getAdminAnalytics
);

router.get(
  '/staff',
  authorize(['VISITOR']),
  getStaffAnalytics
);

export default router;
