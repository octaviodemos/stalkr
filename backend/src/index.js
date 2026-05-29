import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import authRoutes from './routes/auth.js';
import creditsRoutes from './routes/credits.js';
import analyzeRoutes from './routes/analyze.js';
import webhookRoutes from './routes/webhook.js';

const app = express();

app.use(
  cors({
    origin: config.frontendUrl,
    credentials: true,
  })
);

app.use(
  '/api/webhook/stripe',
  express.raw({ type: 'application/json' }),
  webhookRoutes
);

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/credits', creditsRoutes);
app.use('/api/analyze', analyzeRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

function isEnvDefined(name) {
  const value = process.env[name];
  return Boolean(value && !value.startsWith('TODO'));
}

console.log('[Supabase URL]', process.env.SUPABASE_URL || '(not set)');
console.log('[Supabase env]', {
  SUPABASE_URL: isEnvDefined('SUPABASE_URL'),
  SUPABASE_ANON_KEY: isEnvDefined('SUPABASE_ANON_KEY'),
  SUPABASE_SERVICE_ROLE_KEY: isEnvDefined('SUPABASE_SERVICE_ROLE_KEY'),
});

app.listen(config.port, () => {
  console.log(`Stalkr API running on http://localhost:${config.port}`);
});
