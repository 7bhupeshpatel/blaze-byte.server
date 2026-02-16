// src/routes/admin.routes.ts
import { Router } from 'express';
import { authorize } from '../middlewares/auth.middleware';
import prisma from '../config/db.config'; // Assume you exported prisma instance here

const router = Router();

router.patch('/approve-user', authorize(['SUPERADMIN']), async (req, res) => {
  const { userId, role, validTill } = req.body;
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { role, isValidTill: new Date(validTill) }
  });
  res.json(updatedUser);
});