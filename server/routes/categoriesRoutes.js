import express from 'express';
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  updateCategoriesOrder
} from '../controllers/categoriesController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Rutas públicas (para landing page y selectores)
router.get('/', getAllCategories);
router.get('/:id', getCategoryById);

// Rutas protegidas (para el panel de administración)
router.post('/', verifyToken, createCategory);
router.put('/:id', verifyToken, updateCategory);
router.delete('/:id', verifyToken, deleteCategory);
router.patch('/reorder', verifyToken, updateCategoriesOrder);

export default router;
