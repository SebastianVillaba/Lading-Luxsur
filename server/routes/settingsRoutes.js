import express from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Público para la landing
router.get('/', getSettings);

// Protegido para el admin
router.put('/', verifyToken, updateSettings);

export default router;
