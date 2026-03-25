import express from 'express';
import { createRequest, getRequests, getRequest, updateRequest, escalateRequest } from '../controllers/requestController.js';
import { createRequestValidation } from '../validators/requestValidator.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .post(createRequestValidation, createRequest)
  .get(getRequests);

router.route('/:id')
  .get(getRequest)
  .patch(updateRequest);

router.post('/:id/escalate', escalateRequest);

export default router;
