import { Router } from 'express';
import {
  createPaymentIntent,
  confirmPayment,
  getPaymentHistory,
  handleStripeWebhook,
} from '../controllers/paymentController';
import { authenticate } from '../middleware/auth';

const router = Router();

/**
 * @route   POST /api/payments/create-intent
 * @desc    Create a payment intent
 * @access  Private (Client)
 */
router.post('/create-intent', authenticate, createPaymentIntent);

/**
 * @route   POST /api/payments/confirm
 * @desc    Confirm payment
 * @access  Private
 */
router.post('/confirm', authenticate, confirmPayment);

/**
 * @route   GET /api/payments/history
 * @desc    Get payment history
 * @access  Private
 */
router.get('/history', authenticate, getPaymentHistory);

/**
 * @route   POST /api/payments/webhook
 * @desc    Stripe webhook handler
 * @access  Public (Stripe only)
 */
router.post('/webhook', handleStripeWebhook);

export default router;
