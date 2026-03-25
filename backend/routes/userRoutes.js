import express from 'express';
import { getUsers, updateUser, deactivateUser } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', authorize('hod'), getUsers);
router.patch('/:id', updateUser);
router.delete('/:id', authorize('hod'), deactivateUser);

export default router;
