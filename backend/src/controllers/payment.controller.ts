import { Request, Response } from 'express';
import crypto from 'crypto';
import { getUserById, updateUser } from './auth.controller';

export const createOrder = async (req: Request, res: Response) => {
  try {
    const Razorpay = require('razorpay');

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: parseInt(process.env.PREMIUM_PRICE || '49900'), // Amount in paise (499 INR)
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        userId: req.userId, // Fixed: use req.userId from auth middleware
        plan: 'premium',
      },
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error: any) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment order',
      error: error.message,
    });
  }
};

export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    // Verify signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature !== expectedSign) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature',
      });
    }

    // Payment verified successfully - upgrade user to premium
    const userId = req.userId; // Fixed: use req.userId from auth middleware
    const user = await getUserById(userId!);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Calculate subscription dates (1 year from now)
    const startDate = new Date();
    const endDate = new Date();
    endDate.setFullYear(endDate.getFullYear() + 1);

    const updatedUser = await updateUser(userId!, {
      subscription: {
        tier: 'premium',
        startDate,
        endDate,
        paymentId: razorpay_payment_id,
      },
    });

    res.json({
      success: true,
      message: 'Payment verified and subscription upgraded successfully',
      subscription: updatedUser.subscription,
    });
  } catch (error: any) {
    console.error('Error verifying payment:', error);
    res.status(500).json({
      success: false,
      message: 'Payment verification failed',
      error: error.message,
    });
  }
};

export const getSubscriptionStatus = async (req: Request, res: Response) => {
  try {
    const userId = req.userId; // Fixed: use req.userId from auth middleware
    const user = await getUserById(userId!);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      subscription: user.subscription,
    });
  } catch (error: any) {
    console.error('Error getting subscription status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get subscription status',
      error: error.message,
    });
  }
};

export const webhook = async (req: Request, res: Response) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers['x-razorpay-signature'] as string;

    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret!)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (signature !== expectedSignature) {
      return res.status(400).json({
        success: false,
        message: 'Invalid webhook signature',
      });
    }

    const event = req.body.event;
    const payload = req.body.payload;

    // Handle different webhook events
    if (event === 'payment.captured') {
      // Payment successful - already handled in verifyPayment
      console.log('Payment captured:', payload.payment.entity.id);
    } else if (event === 'payment.failed') {
      console.log('Payment failed:', payload.payment.entity.id);
      // Handle failed payment if needed
    }

    res.json({ success: true, message: 'Webhook processed' });
  } catch (error: any) {
    console.error('Webhook error:', error);
    res.status(500).json({
      success: false,
      message: 'Webhook processing failed',
      error: error.message,
    });
  }
};
