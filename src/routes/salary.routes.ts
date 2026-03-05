import { Router } from 'express';
import * as salaryController from '../controllers/salary.controller';
import { verifyToken } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';

const router = Router();

router.use(verifyToken);

// Only Admins should be able to view or process payroll
router.post('/', authorize(['ADMIN', 'SUPERADMIN']), salaryController.recordSalary);
router.get('/', authorize(['ADMIN', 'SUPERADMIN']), salaryController.fetchSalaries);

export default router;