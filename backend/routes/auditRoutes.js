import express from 'express';
import { getSystemAuditLogs } from '../controllers/auditController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(authorize('hod'));

router.route('/')
  .get(getSystemAuditLogs);

export default router;
