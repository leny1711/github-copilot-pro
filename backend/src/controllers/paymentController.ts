import { Request, Response } from 'express';
import stripe from '../config/stripe';
import prisma from '../config/database';
import { config } from '../config';

/**
 * Create a payment intent for a mission
 */
export const createPaymentIntent = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }
    
    const { missionId } = req.body;
    
    // Get mission details
    const mission = await prisma.mission.findUnique({
      where: { id: missionId },
      include: {
        client: true,
      },
    });
    
    if (!mission) {
      res.status(404).json({ error: 'Mission not found' });
      return;
    }
    
    // Check authorization
    if (mission.clientId !== req.user.userId) {
      res.status(403).json({ error: 'Not authorized' });
      return;
    }
    
    // Calculate amounts
    const amount = Math.round(mission.estimatedPrice * 100); // Convert to cents
    const commission = Math.round((mission.commission || 0) * 100);
    const providerAmount = amount - commission;
    
    // Create Stripe customer if not exists
    let stripeCustomerId = mission.client.stripeCustomerId;
    
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: mission.client.email,
        name: `${mission.client.firstName} ${mission.client.lastName}`,
      });
      
      stripeCustomerId = customer.id;
      
      await prisma.user.update({
        where: { id: mission.client.id },
        data: { stripeCustomerId: customer.id },
      });
    }
    
    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'eur',
      customer: stripeCustomerId,
      metadata: {
        missionId: mission.id,
        clientId: mission.clientId,
        providerId: mission.providerId || '',
      },
    });
    
    // Create payment record
    await prisma.payment.create({
      data: {
        amount: mission.estimatedPrice,
        commission: mission.commission || 0,
        providerAmount: providerAmount / 100,
        currency: 'eur',
        status: 'PENDING',
        stripePaymentIntent: paymentIntent.id,
        missionId: mission.id,
        userId: mission.clientId,
      },
    });
    
    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('Create payment intent error:', error);
    res.status(500).json({ error: 'Failed to create payment intent' });
  }
};

/**
 * Confirm payment (called after Stripe confirms payment)
 */
export const confirmPayment = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }
    
    const { paymentIntentId } = req.body;
    
    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status !== 'succeeded') {
      res.status(400).json({ error: 'Payment not completed' });
      return;
    }
    
    // Update payment in database
    const payment = await prisma.payment.update({
      where: { stripePaymentIntent: paymentIntentId },
      data: {
        status: 'COMPLETED',
        stripeChargeId: paymentIntent.latest_charge as string,
      },
      include: {
        mission: true,
      },
    });
    
    res.json({
      message: 'Payment confirmed',
      payment,
    });
  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({ error: 'Failed to confirm payment' });
  }
};

/**
 * Get payment history for user
 */
export const getPaymentHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }
    
    const payments = await prisma.payment.findMany({
      where: {
        userId: req.user.userId,
      },
      include: {
        mission: {
          select: {
            id: true,
            title: true,
            status: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    res.json({ payments });
  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({ error: 'Failed to get payment history' });
  }
};

/**
 * Webhook handler for Stripe events
 */
export const handleStripeWebhook = async (req: Request, res: Response): Promise<void> => {
  try {
    const sig = req.headers['stripe-signature'];
    
    if (!sig) {
      res.status(400).json({ error: 'No signature' });
      return;
    }
    
    let event;
    
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        config.stripe.webhookSecret
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      res.status(400).json({ error: 'Invalid signature' });
      return;
    }
    
    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        await prisma.payment.updateMany({
          where: { stripePaymentIntent: paymentIntent.id },
          data: { status: 'COMPLETED' },
        });
        break;
      
      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        await prisma.payment.updateMany({
          where: { stripePaymentIntent: failedPayment.id },
          data: { status: 'FAILED' },
        });
        break;
      
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
    
    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
};
