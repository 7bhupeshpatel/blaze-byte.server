import { Router } from 'express';
import { 
  handleAddStaff, 
  handleAddProduct, 
  fetchInventory ,
  fetchStaff,
  updateProduct,
  deleteProduct,
  updateStaff,
  deleteStaff
} from '../controllers/workspace.controller';
import { authorize, verifyToken } from '../middlewares/auth.middleware';

const router = Router();

router.use(verifyToken);
/**
 * @route   POST /api/workspace/add-staff
 * @desc    Admin adds a staff member (VISITOR) to their company
 * @access  Private (ADMIN only)
 */
router.post(
  '/add-staff',  
  authorize(['ADMIN']), 
  handleAddStaff
);

/**
 * @route   POST /api/workspace/add-product
 * @desc    Admin adds food items to their company menu
 * @access  Private (ADMIN only)
 */
router.post(
  '/add-product', 
  authorize(['ADMIN']), 
  handleAddProduct
);

/**
 * @route   GET /api/workspace/inventory
 * @desc    Fetch products belonging to the user's specific company
 * @access  Private (ADMIN and VISITOR/STAFF)
 */
router.get(
  '/inventory',  
  authorize(['ADMIN', 'VISITOR']), 
  fetchInventory
);

router.get(
  '/staff',
  authorize(['ADMIN', 'SUPERADMIN']),
  fetchStaff
);

router.patch(
  '/product/:id',
  authorize(['ADMIN']),
  updateProduct
);

router.delete(
  '/product/:id',
  authorize(['ADMIN']),
  deleteProduct
);

router.patch(
  '/staff/:id',
  authorize(['ADMIN']),
  updateStaff
);

router.delete(
  '/staff/:id',
  authorize(['ADMIN']),
  deleteStaff
);


export default router;