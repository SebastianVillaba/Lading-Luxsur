import express from 'express';
import {
  getExperiences,
  saveExperience,
  deleteExperience,
  getServices,
  saveService,
  deleteService,
  getRooftopInfo,
  updateRooftopInfo,
  getHistory,
  updateHistory
} from '../controllers/contentController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Rutas de Historia
router.get('/history', getHistory);
router.put('/history', verifyToken, updateHistory);

// Rutas de Experiencias
router.get('/experiences', getExperiences);
router.post('/experiences', verifyToken, saveExperience);
router.delete('/experiences/:id', verifyToken, deleteExperience);

// Rutas de Servicios
router.get('/services', getServices);
router.post('/services', verifyToken, saveService);
router.delete('/services/:id', verifyToken, deleteService);

// Rutas de Restaurante Rooftop
router.get('/rooftop', getRooftopInfo);
router.put('/rooftop', verifyToken, updateRooftopInfo);

export default router;
