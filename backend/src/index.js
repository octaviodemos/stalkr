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

app.listen(config.port, () => {
  console.log(`Stalkr API running on http://localhost:${config.port}`);
});
