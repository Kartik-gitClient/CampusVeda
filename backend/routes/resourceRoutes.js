import express from 'express';
import { getResources, getResource, createResource, updateResource, deleteResource } from '../controllers/resourceController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getResources)
  .post(authorize('hod'), createResource);

router.route('/:id')
  .get(getResource)
  .patch(authorize('hod'), updateResource)
  .delete(authorize('hod'), deleteResource);

export default router;
