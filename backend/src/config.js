import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  supabaseUrl: process.env.SUPABASE_URL || 'TODO_SUPABASE_URL',
  supabaseServiceKey:
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    'TODO_SUPABASE_SERVICE_ROLE_KEY',
  apifyToken: process.env.APIFY_API_TOKEN || 'TODO_APIFY_API_TOKEN',
  stripeSecretKey: process.env.STRIPE_SECRET_KEY || 'TODO_STRIPE_SECRET_KEY',
  stripeWebhookSecret:
    process.env.STRIPE_WEBHOOK_SECRET || 'TODO_STRIPE_WEBHOOK_SECRET',
  jwtSecret: process.env.JWT_SECRET || 'TODO_JWT_SECRET',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  stripePrices: {
    oneCredit: process.env.STRIPE_PRICE_1_CREDIT || 'TODO_STRIPE_PRICE_ID_1_CREDIT',
    fiveCredits:
      process.env.STRIPE_PRICE_5_CREDITS || 'TODO_STRIPE_PRICE_ID_5_CREDITS',
    unlimited:
      process.env.STRIPE_PRICE_UNLIMITED ||
      'TODO_STRIPE_PRICE_ID_UNLIMITED_MONTHLY',
  },
};
