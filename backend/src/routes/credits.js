import { Router } from 'express';
import { requireAuth, loadUser, hasActiveUnlimited } from '../middleware/auth.js';
import { getSupabase } from '../services/supabase.js';
import { createCheckoutSession } from '../services/stripe.js';

const router = Router();

router.get('/', requireAuth, loadUser, (req, res) => {
  const unlimited = hasActiveUnlimited(req.user);
  return res.json({
    credits: req.user.credits,
    unlimited,
    subscription_expires_at: req.user.subscription_expires_at,
  });
});

router.post('/use', requireAuth, loadUser, async (req, res) => {
  try {
    if (hasActiveUnlimited(req.user)) {
      return res.json({ credits: req.user.credits, unlimited: true });
    }

    if (req.user.credits < 1) {
      return res.status(402).json({ error: 'No credits remaining' });
    }

    const { data: updated, error } = await getSupabase()
      .from('users')
      .update({ credits: req.user.credits - 1 })
      .eq('id', req.userId)
      .select('credits')
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json({ credits: updated.credits, unlimited: false });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.post('/checkout', requireAuth, loadUser, async (req, res) => {
  try {
    const { priceType } = req.body;
    if (!['1', '5', 'unlimited'].includes(priceType)) {
      return res.status(400).json({ error: 'Invalid price type' });
    }

    const session = await createCheckoutSession(
      req.userId,
      req.user.email,
      priceType
    );

    return res.json({ url: session.url });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
