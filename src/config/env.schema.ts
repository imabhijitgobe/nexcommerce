import { z } from 'zod';

// Fail-fast env validation per docs/env.md S12. Missing/invalid REQUIRED var
// exits the process at import time; never boot half-configured.
// Covers every key in .env.example (P4-017) plus documented optionals.

const boolString = z.enum(['true', 'false']).transform((v) => v === 'true');

export const envSchema = z.object({
  // --- Server (docs/env.md S3) ---
  NODE_ENV: z.enum(['development', 'staging', 'production', 'test']),
  PORT: z.coerce.number().default(5000),
  CLIENT_URL: z.string().url(),
  API_VERSION: z.string().default('v1'),

  // --- Database & Search (docs/env.md S4) ---
  DATABASE_URL: z.string().startsWith('postgresql://'),
  REDIS_URL: z.string().startsWith('redis'),
  ELASTICSEARCH_URL: z.string().url(),
  ELASTICSEARCH_INDEX: z.string().default('products'),
  CLICKHOUSE_URL: z.string().url(),
  CLICKHOUSE_DB: z.string().default('nexcommerce'),

  // --- Auth (docs/env.md S5) ---
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('15m'),
  REFRESH_SECRET: z.string().min(32),
  REFRESH_EXPIRES_IN: z.string().default('7d'),
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),

  // --- AI (docs/env.md S6) ---
  OPENAI_API_KEY: z.string().startsWith('sk-'),
  OPENAI_MODEL: z.string().default('gpt-4o'),
  OPENAI_EMBEDDING_MODEL: z.string().default('text-embedding-3-small'),
  PINECONE_API_KEY: z.string().min(1),
  PINECONE_INDEX: z.string().default('products'),
  PINECONE_ENV: z.string().default('us-east-1'),
  AI_RATE_LIMIT_PER_USER: z.coerce.number().default(30),
  AI_MODERATION_THRESHOLD: z.coerce.number().default(0.8),

  // --- Payments (docs/env.md S7) ---
  STRIPE_SECRET_KEY: z.string().startsWith('sk_'),
  STRIPE_WEBHOOK_SECRET: z.string().startsWith('whsec_'),
  STRIPE_CONNECT_CLIENT: z.string().min(1),
  STRIPE_PAYOUT_MINIMUM_INR: z.coerce.number().default(50000),

  // --- Third party (docs/env.md S8) ---
  SENDGRID_API_KEY: z.string().min(1),
  SENDGRID_FROM_EMAIL: z.string().email(),
  TWILIO_ACCOUNT_SID: z.string().min(1),
  TWILIO_AUTH_TOKEN: z.string().min(1),
  TWILIO_PHONE: z.string().min(1),
  FIREBASE_SERVER_KEY: z.string().min(1),
  GOOGLE_MAPS_KEY: z.string().min(1),
  AWS_ACCESS_KEY: z.string().min(1),
  AWS_SECRET_KEY: z.string().min(1),
  AWS_BUCKET_NAME: z.string().min(1),
  AWS_REGION: z.string().min(1),

  // --- Observability (docs/env.md S9, optional locally) ---
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  SENTRY_DSN: z.string().optional(),

  // --- Feature flags & tuning (docs/env.md S10, optional) ---
  ENABLE_SEMANTIC_SEARCH: boolString.default(true),
  ENABLE_RAG_CHATBOT: boolString.default(true),
  ENABLE_DYNAMIC_PRICING: boolString.default(false),
  ENABLE_FRAUD_CHECK: boolString.default(true),
  CACHE_TTL_DASHBOARD_SEC: z.coerce.number().default(300),
  CART_TTL_MIN: z.coerce.number().default(15),
  DRIVER_ACCEPT_TIMEOUT_SEC: z.coerce.number().default(60)
});

