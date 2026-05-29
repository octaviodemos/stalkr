export const config = {
  get port() {
    return parseInt(process.env.PORT || '3001', 10);
  },
  get supabaseUrl() {
    return process.env.SUPABASE_URL || 'TODO_SUPABASE_URL';
  },
  get supabaseServiceKey() {
    return (
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_ANON_KEY ||
      'TODO_SUPABASE_SERVICE_ROLE_KEY'
    );
  },
  get apifyToken() {
    return process.env.APIFY_API_TOKEN || 'TODO_APIFY_API_TOKEN';
  },
  get stripeSecretKey() {
    return process.env.STRIPE_SECRET_KEY || 'TODO_STRIPE_SECRET_KEY';
  },
  get stripeWebhookSecret() {
    return process.env.STRIPE_WEBHOOK_SECRET || 'TODO_STRIPE_WEBHOOK_SECRET';
  },
  get jwtSecret() {
    return process.env.JWT_SECRET || 'TODO_JWT_SECRET';
  },
  get frontendUrl() {
    return process.env.FRONTEND_URL || 'http://localhost:3000';
  },
  get stripePrices() {
    return {
      oneCredit:
        process.env.STRIPE_PRICE_1_CREDIT || 'TODO_STRIPE_PRICE_ID_1_CREDIT',
      fiveCredits:
        process.env.STRIPE_PRICE_5_CREDITS || 'TODO_STRIPE_PRICE_ID_5_CREDITS',
      unlimited:
        process.env.STRIPE_PRICE_UNLIMITED ||
        'TODO_STRIPE_PRICE_ID_UNLIMITED_MONTHLY',
    };
  },
};
