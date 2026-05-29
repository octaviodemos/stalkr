import Stripe from 'stripe';
import { config } from '../config.js';

export const stripe = new Stripe(config.stripeSecretKey);

export async function createCheckoutSession(userId, email, priceType) {
  const priceMap = {
    '1': { priceId: config.stripePrices.oneCredit, mode: 'payment', credits: 1 },
    '5': { priceId: config.stripePrices.fiveCredits, mode: 'payment', credits: 5 },
    unlimited: {
      priceId: config.stripePrices.unlimited,
      mode: 'subscription',
      credits: 0,
    },
  };

  const plan = priceMap[priceType];
  if (!plan) {
    throw new Error('Invalid price type');
  }

  const sessionParams = {
    mode: plan.mode,
    success_url: `${config.frontendUrl}/dashboard?payment=success`,
    cancel_url: `${config.frontendUrl}/?payment=cancelled`,
    customer_email: email,
    metadata: {
      userId,
      priceType,
      credits: String(plan.credits),
    },
  };

  if (plan.mode === 'subscription') {
    sessionParams.line_items = [{ price: plan.priceId, quantity: 1 }];
    sessionParams.metadata.plan = 'unlimited';
  } else {
    sessionParams.line_items = [{ price: plan.priceId, quantity: 1 }];
  }

  return stripe.checkout.sessions.create(sessionParams);
}
