import { envSchema } from '../../src/config/env.schema';

// Fail-fast contract per docs/env.md S12 (todos P4-018): missing or invalid
// REQUIRED vars must throw at import time so the app never boots half-configured.
const validEnv = {
  NODE_ENV: 'test',
  PORT: '5000',
  CLIENT_URL: 'http://localhost:3000',
  API_VERSION: 'v1',
  DATABASE_URL: 'postgresql://nex:nexpass@localhost:5432/nexcommerce?schema=public',
  REDIS_URL: 'redis://localhost:6379',
  ELASTICSEARCH_URL: 'http://localhost:9200',
  CLICKHOUSE_URL: 'http://localhost:8123',
  JWT_SECRET: 'local-dev-only-secret-min-32-chars!!',
  REFRESH_SECRET: 'local-dev-only-refresh-min-32-chars!',
  GOOGLE_CLIENT_ID: 'xxx.apps.googleusercontent.com',
  GOOGLE_CLIENT_SECRET: 'xxx',
  OPENAI_API_KEY: 'sk-...',
  PINECONE_API_KEY: 'xxx',
  STRIPE_SECRET_KEY: 'sk_test_...',
  STRIPE_WEBHOOK_SECRET: 'whsec_...',
  STRIPE_CONNECT_CLIENT: 'ca_...',
  SENDGRID_API_KEY: 'SG.xxx',
  SENDGRID_FROM_EMAIL: 'no-reply@nexcommerce.com',
  TWILIO_ACCOUNT_SID: 'ACxxx',
  TWILIO_AUTH_TOKEN: 'xxx',
  TWILIO_PHONE: '+1555555555',
  FIREBASE_SERVER_KEY: 'xxx',
  GOOGLE_MAPS_KEY: 'AIza...',
  AWS_ACCESS_KEY: 'AKIA...',
  AWS_SECRET_KEY: 'xxx',
  AWS_BUCKET_NAME: 'my-bucket',
  AWS_REGION: 'ap-south-1'
};

describe('env fail-fast (P4-018)', () => {
  test('parses full valid env and applies documented defaults', () => {
    const parsed = envSchema.parse(validEnv);
    expect(parsed.PORT).toBe(5000);
    expect(parsed.LOG_LEVEL).toBe('info');
    expect(parsed.ENABLE_SEMANTIC_SEARCH).toBe(true);
    expect(parsed.ENABLE_DYNAMIC_PRICING).toBe(false);
    expect(parsed.CART_TTL_MIN).toBe(15);
  });

  test('throws when a REQUIRED var is missing (DATABASE_URL)', () => {
    const { DATABASE_URL: _dropped, ...rest } = validEnv;
    expect(() => envSchema.parse(rest)).toThrow();
  });

  test('throws when JWT_SECRET is shorter than 32 chars', () => {
    expect(() => envSchema.parse({ ...validEnv, JWT_SECRET: 'too-short' })).toThrow();
  });

  test('throws when OPENAI_API_KEY has the wrong prefix', () => {
    expect(() => envSchema.parse({ ...validEnv, OPENAI_API_KEY: 'pk-...' })).toThrow();
  });

  test('throws when STRIPE_SECRET_KEY has the wrong prefix', () => {
    expect(() => envSchema.parse({ ...validEnv, STRIPE_SECRET_KEY: 'pk_test_...' })).toThrow();
  });
});
