import express from 'express';
import { getConflicts, resolveConflict } from '../controllers/conflictController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(authorize('senior', 'hod')); // Only senior/HOD see conflicts

router.route('/')
  .get(getConflicts);

router.route('/:id/resolve')
  .patch(resolveConflict);

export default router;
