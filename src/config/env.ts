import { z } from 'zod';

// Fail-fast env validation per docs/env.md S12. Missing/invalid REQUIRED var
// exits the process at import time; never boot half-configured.
export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'staging', 'production', 'test']),
  PORT: z.coerce.number().default(5000),
  CLIENT_URL: z.string().url(),
  API_VERSION: z.string().default('v1'),
  DATABASE_URL: z.string().startsWith('postgresql://'),
  REDIS_URL: z.string().startsWith('redis'),
  ELASTICSEARCH_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('15m'),
  REFRESH_SECRET: z.string().min(32),
  REFRESH_EXPIRES_IN: z.string().default('7d'),
  OPENAI_API_KEY: z.string().startsWith('sk-'),
  PINECONE_API_KEY: z.string().min(1),
  STRIPE_SECRET_KEY: z.string().startsWith('sk_'),
  STRIPE_WEBHOOK_SECRET: z.string().startsWith('whsec_')
});

export const env = envSchema.parse(process.env);
