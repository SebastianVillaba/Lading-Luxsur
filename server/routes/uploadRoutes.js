import express from 'express';
import { upload } from '../middleware/upload.js';
import { uploadImage, uploadMultipleImages } from '../controllers/uploadController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Subir una imagen
router.post('/single', verifyToken, upload.single('image'), uploadImage);

// Subir múltiples imágenes para la galería
router.post('/multiple', verifyToken, upload.array('images', 10), uploadMultipleImages);

export default router;
