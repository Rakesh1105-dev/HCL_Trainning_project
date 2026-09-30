import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { allowInventoryManager } from '../middleware/roleMiddleware.js';
import {
  createSupplier,
  getSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
} from '../controllers/supplierController.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', allowInventoryManager, getSuppliers);
router.post('/', allowInventoryManager, createSupplier);
router.get('/:id', allowInventoryManager, getSupplierById);
router.put('/:id', allowInventoryManager, updateSupplier);
router.delete('/:id', allowInventoryManager, deleteSupplier);

export default router;
