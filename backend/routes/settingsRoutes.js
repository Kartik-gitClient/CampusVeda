import express from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(authorize('hod'));

router.route('/')
  .get(getSettings)
  .patch(updateSettings);

export default router;
