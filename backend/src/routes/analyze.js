import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getSupabase } from '../services/supabase.js';
import { fetchInstagramFollowing } from '../services/apify.js';
import { classifyFollowingList, groupByGender } from '../services/genderize.js';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { username } = req.body;

    if (!username?.trim()) {
      return res.status(400).json({ error: 'Username required' });
    }

    const targetUsername = username.replace(/^@/, '').trim().toLowerCase();

    const following = await fetchInstagramFollowing(targetUsername);
    const classified = await classifyFollowingList(following);
    const result = groupByGender(classified);

    return res.json(result);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.get('/history', requireAuth, async (req, res) => {
  try {
    const { data, error } = await getSupabase()
      .from('analyses')
      .select('id, target_username, created_at')
      .eq('user_id', req.userId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json({ analyses: data || [] });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
