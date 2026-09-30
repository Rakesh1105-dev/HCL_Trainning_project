import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { allowOrderManager, allowOrderRead } from '../middleware/roleMiddleware.js';
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
} from '../controllers/orderController.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', allowOrderRead, getOrders);
router.post('/', allowOrderManager, createOrder);
router.get('/:id', allowOrderRead, getOrderById);
router.put('/:id/status', allowOrderManager, updateOrderStatus);
router.put('/:id/cancel', allowOrderManager, cancelOrder);

export default router;
