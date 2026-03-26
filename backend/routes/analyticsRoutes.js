import express from 'express';
import { getOverview, getRequestsTrend, getConflictStats, getDepartmentUsage } from '../controllers/analyticsController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(protect);
// Overview is accessible by all; detailed analytics restricted to senior/hod
router.get('/overview', getOverview);
router.get('/requests-trend', authorize('senior', 'hod'), getRequestsTrend);
router.get('/conflicts', authorize('senior', 'hod'), getConflictStats);
router.get('/department-usage', authorize('senior', 'hod'), getDepartmentUsage);

export default router;
