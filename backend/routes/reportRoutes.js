import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { allowAdmin } from '../middleware/roleMiddleware.js';
import {
  getDashboardStats,
  getInventoryReport,
  getOrderReport,
  getSalesReport,
  getSupplierReport,
  getWarehouseReport,
} from '../controllers/reportController.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/dashboard', allowAdmin, getDashboardStats);
router.get('/inventory', allowAdmin, getInventoryReport);
router.get('/orders', allowAdmin, getOrderReport);
router.get('/sales', allowAdmin, getSalesReport);
router.get('/suppliers', allowAdmin, getSupplierReport);
router.get('/warehouses', allowAdmin, getWarehouseReport);

export default router;
