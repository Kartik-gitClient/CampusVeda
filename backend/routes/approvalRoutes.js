import express from 'express';
import { processApproval, getApprovals } from '../controllers/approvalController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router({ mergeParams: true });

router.use(protect);

router.route('/:requestId')
  .post(authorize('senior', 'hod'), processApproval)
  .get(getApprovals);

export default router;
