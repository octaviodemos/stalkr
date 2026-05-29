import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { getSupabase } from '../services/supabase.js';

export function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token required' });
  }

  const token = header.slice(7);

  try {
    const payload = jwt.verify(token, config.jwtSecret);
    req.userId = payload.userId;
    req.userEmail = payload.email;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

export async function loadUser(req, res, next) {
  const { data: user, error } = await getSupabase()
    .from('users')
    .select('id, email, credits, subscription_expires_at')
    .eq('id', req.userId)
    .single();

  if (error || !user) {
    return res.status(401).json({ error: 'User not found' });
  }

  req.user = user;
  next();
}

export function hasActiveUnlimited(user) {
  if (!user.subscription_expires_at) return false;
  return new Date(user.subscription_expires_at) > new Date();
}
