import { Router } from 'express';
import {
  createOrder,
  verifyPayment,
  getSubscriptionStatus,
  webhook,
} from '../controllers/payment.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Create Razorpay order (protected route)
router.post('/create-order', authMiddleware, createOrder);

// Verify payment and upgrade subscription (protected route)
router.post('/verify', authMiddleware, verifyPayment);

// Get subscription status (protected route)
router.get('/subscription', authMiddleware, getSubscriptionStatus);

// Razorpay webhook (unprotected - verified by signature)
router.post('/webhook', webhook);

export default router;
