import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { allowProductManage, allowCategoryManage, allowProductRead } from '../middleware/roleMiddleware.js';
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} from '../controllers/productController.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', allowProductRead, getProducts);
router.post('/', allowProductManage, createProduct);
router.post('/categories', allowCategoryManage, createCategory);
router.get('/categories', allowProductRead, getCategories);
router.put('/categories/:id', allowCategoryManage, updateCategory);
router.delete('/categories/:id', allowCategoryManage, deleteCategory);
router.get('/:id', allowProductRead, getProductById);
router.put('/:id', allowProductManage, updateProduct);
router.delete('/:id', allowProductManage, deleteProduct);

export default router;
