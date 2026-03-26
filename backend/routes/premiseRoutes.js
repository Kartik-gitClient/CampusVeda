import express from 'express';
import { getPremise, updatePremise } from '../controllers/premiseController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getPremise)
  .post(protect, authorize('hod'), updatePremise);

export default router;
