import Stripe from 'stripe';
import { config } from './index';

// Initialize Stripe with secret key
const stripe = new Stripe(config.stripe.secretKey, {
  apiVersion: '2023-10-16',
});

export default stripe;
