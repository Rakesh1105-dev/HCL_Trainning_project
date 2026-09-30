import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { allowAdmin, allowWarehouseRead } from '../middleware/roleMiddleware.js';
import {
  createWarehouse,
  getWarehouses,
  getWarehouseById,
  updateWarehouse,
  deleteWarehouse,
  getWarehouseInventory,
} from '../controllers/warehouseController.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', allowWarehouseRead, getWarehouses);
router.post('/', allowAdmin, createWarehouse);
router.get('/:id', allowWarehouseRead, getWarehouseById);
router.put('/:id', allowAdmin, updateWarehouse);
router.delete('/:id', allowAdmin, deleteWarehouse);
router.get('/:id/inventory', allowWarehouseRead, getWarehouseInventory);

export default router;
