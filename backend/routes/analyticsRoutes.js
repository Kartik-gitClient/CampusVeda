import express from 'express';
import { getOverview, getRequestsTrend, getConflictStats, getDepartmentUsage } from '../controllers/analyticsController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(authorize('senior', 'hod'));

router.get('/overview', getOverview);
router.get('/requests-trend', getRequestsTrend);
router.get('/conflicts', getConflictStats);
router.get('/department-usage', getDepartmentUsage);

export default router;
