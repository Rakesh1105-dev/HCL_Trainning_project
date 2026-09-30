import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { allowInventoryWrite, allowInventoryRead } from '../middleware/roleMiddleware.js';
import {
  getInventoryList,
  getInventoryById,
  adjustInventory,
  transferInventory,
  getLowStockInventory,
  getStockTransactions,
} from '../controllers/inventoryController.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', allowInventoryRead, getInventoryList);
router.post('/adjust', allowInventoryWrite, adjustInventory);
router.post('/transfer', allowInventoryWrite, transferInventory);
router.get('/low-stock', allowInventoryRead, getLowStockInventory);
router.get('/transactions', allowInventoryRead, getStockTransactions);
router.get('/:id', allowInventoryRead, getInventoryById);

export default router;
