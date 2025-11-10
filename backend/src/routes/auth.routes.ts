import { Router } from 'express';
import { register, login, getMe, getAllUsers } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', authMiddleware, getMe);

// Debug route (remove in production)
router.get('/users', getAllUsers);

export default router;
