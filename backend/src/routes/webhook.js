import { Router } from 'express';
import { stripe } from '../services/stripe.js';
import { config } from '../config.js';
import { getSupabase } from '../services/supabase.js';

const router = Router();

router.post('/', async (req, res) => {
  const signature = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      config.stripeWebhookSecret
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.metadata?.userId;
    const priceType = session.metadata?.priceType;

    if (!userId) {
      return res.json({ received: true });
    }

    if (priceType === 'unlimited') {
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + 1);

      await getSupabase()
        .from('users')
        .update({ subscription_expires_at: expiresAt.toISOString() })
        .eq('id', userId);
    } else {
      const creditsToAdd = parseInt(session.metadata?.credits || '0', 10);

      if (creditsToAdd > 0) {
        const { data: user } = await getSupabase()
          .from('users')
          .select('credits')
          .eq('id', userId)
          .single();

        if (user) {
          await getSupabase()
            .from('users')
            .update({ credits: user.credits + creditsToAdd })
            .eq('id', userId);
        }
      }
    }
  }

  return res.json({ received: true });
});

export default router;
