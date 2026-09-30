import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { allowInventoryManager, allowPurchaseRead, allowPurchaseReceive } from '../middleware/roleMiddleware.js';
import {
  createPurchase,
  getPurchases,
  getPurchaseById,
  updatePurchaseStatus,
  receivePurchase,
} from '../controllers/purchaseController.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', allowPurchaseRead, getPurchases);
router.post('/', allowInventoryManager, createPurchase);
router.get('/:id', allowPurchaseRead, getPurchaseById);
router.put('/:id/status', allowInventoryManager, updatePurchaseStatus);
router.post('/:id/receive', allowPurchaseReceive, receivePurchase);

export default router;
