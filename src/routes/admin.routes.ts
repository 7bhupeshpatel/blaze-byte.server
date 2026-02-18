import { Router } from 'express';
import * as adminCtrl from '../controllers/admin.controller';
import { verifyToken } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';

const router = Router();

// All routes here require at least ADMIN, but most are SUPERADMIN restricted
router.use(verifyToken);

router.get('/stats', authorize(['ADMIN', 'SUPERADMIN']), adminCtrl.fetchStats);
router.get('/users', authorize(['ADMIN', 'SUPERADMIN']), adminCtrl.fetchAllUsers);
router.get('/audit-logs', authorize(['SUPERADMIN']), adminCtrl.fetchAuditLogs);
// Destructive or Sensitive actions - SUPERADMIN ONLY
router.patch('/users/:id', authorize(['SUPERADMIN']), adminCtrl.modifyUser);
router.delete('/users/bulk', authorize(['SUPERADMIN']), adminCtrl.bulkDelete);

export default router;