import express from 'express';
import {
  getAllUsers,
  createUser,
  updateUser,
  toggleUserStatus,
  deleteUser,
  resetUserPassword
} from '../controllers/usersController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Middleware para restringir acciones exclusivas de Administradores
function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado: Se requieren permisos de Administrador para realizar esta acción.'
    });
  }
  next();
}

// Todas las rutas de usuarios requieren autenticación previa
router.use(verifyToken);

// Consulta de usuarios (disponible para usuarios autenticados)
router.get('/', getAllUsers);

// Modificación y gestión (exclusivo para Administradores)
router.post('/', requireAdmin, createUser);
router.put('/:id', requireAdmin, updateUser);
router.patch('/:id/toggle', requireAdmin, toggleUserStatus);
router.delete('/:id', requireAdmin, deleteUser);
router.post('/:id/password', requireAdmin, resetUserPassword);

export default router;
