import express from 'express';
import { getMyNotifications, markRead } from '../controllers/notificationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getMyNotifications);

router.route('/:id/read')
  .patch(markRead);

export default router;
