import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { allowAdmin } from '../middleware/roleMiddleware.js';
import { getUsers, createUser, updateUser, deactivateUser } from '../controllers/userController.js';

const router = express.Router();

router.use(authMiddleware, allowAdmin);
router.get('/', getUsers);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deactivateUser);

export default router;
