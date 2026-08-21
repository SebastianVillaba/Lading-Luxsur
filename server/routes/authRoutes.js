import express from 'express';
import { login, verifySession, changePassword } from '../controllers/authController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', login);
router.get('/verify', verifyToken, verifySession);
router.post('/change-password', verifyToken, changePassword);

export default router;
