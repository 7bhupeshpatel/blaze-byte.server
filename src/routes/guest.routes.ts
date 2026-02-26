import { Router } from 'express';
import { getCompanyMenu, placeGuestOrder } from '../controllers/guest.controller';

const router = Router();

// GET /api/guest/:companyId/menu
router.get('/:companyId/menu', getCompanyMenu);

// POST /api/guest/:companyId/order
router.post('/:companyId/order', placeGuestOrder);

export default router;