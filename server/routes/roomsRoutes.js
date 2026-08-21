import express from 'express';
import {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
  updateRoomsOrder
} from '../controllers/roomsController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Rutas públicas (para la landing page)
router.get('/', getAllRooms);
router.get('/:id', getRoomById);

// Rutas protegidas (para el panel de administración)
router.post('/', verifyToken, createRoom);
router.put('/:id', verifyToken, updateRoom);
router.delete('/:id', verifyToken, deleteRoom);
router.patch('/reorder', verifyToken, updateRoomsOrder);

export default router;
