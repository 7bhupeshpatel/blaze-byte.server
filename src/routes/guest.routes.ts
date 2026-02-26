import { Router } from 'express';
import { getCompanyMenu, placeGuestOrder, getOrderStatus } from '../controllers/guest.controller';

const router = Router();

// GET /api/guest/:companyId/menu
router.get('/:companyId/menu', getCompanyMenu);

// POST /api/guest/:companyId/order
router.post('/:companyId/order', placeGuestOrder);

router.get("/order/:orderId/status", getOrderStatus);
export default router;