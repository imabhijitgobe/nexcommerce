# Environment Variables Reference — NexCommerce

> **Version:** 1.0.0
> **Last Updated:** 2026-09-05
> **Status:** Active — Normative for local, staging, and production
> **Related Docs:** [architecture.md](./architecture.md) · [git-conventions.md](./git-conventions.md) · [error-codes.md](./error-codes.md)

Single source of truth for all environment configuration. The app MUST fail fast at boot if a REQUIRED variable is missing or invalid (Zod validation in `src/config/env.ts`).

---

## Table of Contents

1. [How to Use](#1-how-to-use)
2. [Conventions](#2-conventions)
3. [Server](#3-server)
4. [Database & Search](#4-database--search)
5. [Auth](#5-auth)
6. [AI](#6-ai)
7. [Payments (Stripe)](#7-payments-stripe)
8. [Third Party (Comms, Maps, AWS)](#8-third-party-comms-maps-aws)
9. [Observability & Security](#9-observability--security)
10. [Feature Flags & Tuning (Optional)](#10-feature-flags--tuning-optional)
11. [Environment-Specific Values](#11-environment-specific-values)
12. [Validation & Boot Behavior](#12-validation--boot-behavior)
13. [`.env.example` Template](#13-envexample-template)

---

## 1. How to Use

- Copy `.env.example` to `.env`
- NEVER commit `.env` to git
- All variables are REQUIRED unless marked (optional)

```bash
cp .env.example .env
# edit .env with real secrets (use AWS Secrets Manager / Doppler in staging/prod)
npm run dev
```

Rules:
1. `.env` is local-only and git-ignored. Secrets live in AWS Secrets Manager / ECS task definitions in staging/prod — never in the repo, Slack, or PRs.
2. Every new variable MUST be added to `.env.example` (with dummy value), this file, and `src/config/env.ts` (Zod schema) in the same PR (`chore(config): add XYZ`).
3. Restart the server after changing `.env`. The app validates on boot and exits with `ADMIN_CONFIG_INVALID`-style log if invalid.
4. Production overrides staging overrides local. See [§11](#11-environment-specific-values).

---

## 2. Conventions

- Names are `UPPER_SNAKE_CASE`. No spaces.
- URLs include scheme + port, no trailing slash: `http://localhost:9200` GOOD, `localhost:9200/` BAD.
- Durations use explicit units: `15m`, `7d` (see `JWT_EXPIRES_IN`).
- Booleans are `true` / `false` (lowercase).
- Comma-separated lists have no spaces: `http://localhost:3000,https://app.nexcommerce.com`.
- `(optional)` variables MUST have a documented default that applies when unset.

---

## 3. Server

| Variable | Example Value | Required | Description |
| :--- | :--- | :---: | :--- |
| NODE_ENV | development | Yes | App environment: `development` \| `staging` \| `production` \| `test` |
| PORT | 5000 | Yes | Server port (ECS maps to ALB target) |
| CLIENT_URL | http://localhost:3000 | Yes | CORS allowed origin. Comma-separated for multi-client (web, vendor portal, admin) |
| API_VERSION | v1 | Yes | API version prefix → routes mount at `/api/v1` |
| REQUEST_ID_HEADER | X-Request-Id | (optional, default `X-Request-Id`) | Correlation header used in error envelope + logs |
| BODY_LIMIT | 1mb | (optional, default `1mb`) | JSON body limit (Express). Uploads stream to S3, not inline |
| TRUST_PROXY | 1 | (optional, default `1` in staging/prod) | Hop count for `X-Forwarded-*` behind ALB/Nginx (rate-limit IP correctness) |

---

## 4. Database & Search

| Variable | Example Value | Required | Description |
| :--- | :--- | :---: | :--- |
| DATABASE_URL | postgresql://nex:nexpass@localhost:5432/nexcommerce?schema=public | Yes | PostgreSQL connection string (Prisma). Use PgBouncer URL in prod (port 6432) |
| DATABASE_POOL_MIN | 5 | (optional, default `5`) | Prisma/PgBouncer min connections |
| DATABASE_POOL_MAX | 20 | (optional, default `20`) | Prisma/PgBouncer max connections per pod |
| REDIS_URL | redis://localhost:6379 | Yes | Redis connection string (cache, sessions, BullMQ backing, rate-limit buckets) |
| ELASTICSEARCH_URL | http://localhost:9200 | Yes | ES connection string (product catalog, faceted search). Use Amazon OpenSearch endpoint in prod |
| ELASTICSEARCH_INDEX | products | (optional, default `products`) | Product index name (prefix per env: `products_dev`) |
| PINECONE_API_KEY | xxx | Yes | Pinecone API key — see [§6](#6-ai) (duplicated here for discoverability) |
| PINECONE_INDEX | products | Yes | Pinecone index name — see [§6](#6-ai) |
| CLICKHOUSE_URL | http://localhost:8123 | Yes | ClickHouse HTTP endpoint (analytics events, GMV rollups). `https://` in prod |
| CLICKHOUSE_DB | nexcommerce | (optional, default `nexcommerce`) | Analytics database name |
| CLICKHOUSE_USER | default | (optional) | Analytics DB user (omit for local default) |
| CLICKHOUSE_PASSWORD | *** | Staging/prod only | Analytics DB password — NEVER in repo |

> S3 variables live in [§8](#8-third-party-comms-maps-aws). PostGIS runs as a Postgres extension — no separate URL.

---

## 5. Auth

| Variable | Example Value | Required | Description |
| :--- | :--- | :---: | :--- |
| JWT_SECRET | your-secret-min-32-chars-change-me | Yes | JWT (access) signing secret. ≥32 random chars. Rotate via Secrets Manager |
| JWT_EXPIRES_IN | 15m | Yes | Access token expiry (`15m` per FR-001) |
| REFRESH_SECRET | your-refresh-secret-different-from-jwt | Yes | Refresh token secret. MUST differ from `JWT_SECRET` |
| REFRESH_EXPIRES_IN | 7d | Yes | Refresh token expiry (`7d`, HTTP-only cookie per FR-001) |
| GOOGLE_CLIENT_ID | xxx.apps.googleusercontent.com | Yes | Google OAuth client ID |
| GOOGLE_CLIENT_SECRET | xxx | Yes | Google OAuth secret |
| GOOGLE_CALLBACK_URL | http://localhost:5000/api/v1/auth/oauth/google/callback | (optional, default built from `PORT`+`API_VERSION`) | OAuth redirect URI (must match Google console per env) |
| FACEBOOK_APP_ID | 1234567890 | (optional, required if FB login enabled) | Facebook OAuth app ID |
| FACEBOOK_APP_SECRET | xxx | (optional, required if FB login enabled) | Facebook OAuth secret |
| BCRYPT_ROUNDS | 12 | (optional, default `12`) | Argon2/bcrypt cost. Note: codebase migrates bcrypt→argon2 (`feat(auth)!`) — see git-conventions |
| LOGIN_RATE_LIMIT | 5 | (optional, default `5`) | Max login/reset attempts per 15min per IP (FR-005) |
| EMAIL_VERIFICATION_TTL | 24h | (optional, default `24h`) | Verification link TTL |

---

## 6. AI

| Variable | Example Value | Required | Description |
| :--- | :--- | :---: | :--- |
| OPENAI_API_KEY | sk-... | Yes | OpenAI API key (GPT-4o + `text-embedding-3-small`) |
| OPENAI_MODEL | gpt-4o | Yes | Default chat model (RAG chatbot, descriptions, review sentiment) |
| OPENAI_EMBEDDING_MODEL | text-embedding-3-small | (optional, default `text-embedding-3-small`) | Embedding model for Pinecone vectors (FR-022) |
| OPENAI_TIMEOUT_MS | 30000 | (optional, default `30000`) | LLM request timeout. Fallback degrades to keyword search on timeout |
| PINECONE_API_KEY | xxx | Yes | Pinecone API key (vector DB for semantic search + RAG) |
| PINECONE_INDEX | products | Yes | Pinecone index name (1536-dim for `text-embedding-3-small`) |
| PINECONE_ENV | us-east-1 | Yes | Pinecone environment / cloud region (legacy envs; `PINECONE_HOST` for serverless) |
| PINECONE_HOST | https://products-xxx.svc.us-east-1-aws.pinecone.io | (optional, required on serverless) | Pinecone host URL — prefer over `PINECONE_ENV` when provided |
| AI_RATE_LIMIT_PER_USER | 30 | (optional, default `30`) | Max LLM calls/user/hour (FR-057, cost guard → `AI_RATE_LIMIT` 429) |
| AI_MODERATION_THRESHOLD | 0.8 | (optional, default `0.8`) | Toxicity score above which reviews hidden (`AI_MODERATION_FLAGGED`) |

---

## 7. Payments (Stripe)

| Variable | Example Value | Required | Description |
| :--- | :--- | :---: | :--- |
| STRIPE_SECRET_KEY | sk_test_... | Yes | Stripe secret key (`sk_test_` dev, `sk_live_` prod via Secrets Manager) |
| STRIPE_WEBHOOK_SECRET | whsec_... | Yes | Stripe webhook signing secret — verify every webhook (`PAYMENT_WEBHOOK_SIGNATURE_INVALID` on fail) |
| STRIPE_CONNECT_CLIENT | ca_... | Yes | Stripe Connect client ID (Express onboarding + destination charges) |
| STRIPE_PUBLISHABLE_KEY | pk_test_... | (optional, frontend only) | Exposed to web client via `/config` — never use secret key client-side |
| STRIPE_PAYOUT_MINIMUM_INR | 50000 | (optional, default `50000` paise = ₹500) | Minimum vendor payout (`VENDOR_PAYOUT_MINIMUM`) |
| STRIPE_API_VERSION | 2024-06-20 | (optional, pinned) | Stripe API version — pin to avoid breaking upgrades |

> All amounts stored as integer paise/cents (FR-034). Webhook handler needs `STRIPE_WEBHOOK_SECRET` + raw body (disable JSON parsing on `/webhooks/stripe`).

---

## 8. Third Party (Comms, Maps, AWS)

| Variable | Example Value | Required | Description |
| :--- | :--- | :---: | :--- |
| SENDGRID_API_KEY | SG.xxx | Yes | Email service (order confirmations, KYC outcomes, password reset) |
| SENDGRID_FROM_EMAIL | no-reply@nexcommerce.com | Yes | Verified sender identity |
| TWILIO_ACCOUNT_SID | ACxxx | Yes | SMS service (OTP, dispatch alerts) |
| TWILIO_AUTH_TOKEN | xxx | Yes | Twilio auth — Secrets Manager only |
| TWILIO_PHONE | +1555555555 | Yes | Twilio sender phone number (E.164) |
| FIREBASE_SERVER_KEY | xxx | Yes | Push notifications (FCM — order/delivery updates). Prefer `FIREBASE_SERVICE_ACCOUNT_JSON` (base64) for Admin SDK in prod |
| GOOGLE_MAPS_KEY | AIza... | Yes | Maps API key (address geocoding FR-007, route optimization FR-040). Restrict by HTTP referrer + API |
| AWS_ACCESS_KEY | AKIA... | Local/dev only | AWS credentials — use IAM roles for ECS in staging/prod, NEVER long-lived keys |
| AWS_SECRET_KEY | xxx | Local/dev only | AWS secret — IAM roles in staging/prod |
| AWS_BUCKET_NAME | my-bucket | Yes | S3 bucket name (product images, KYC docs, avatars). KYC in private prefix with SSE-KMS |
| AWS_REGION | ap-south-1 | Yes | AWS region (S3, RDS, ElastiCache, OpenSearch must match VPC) |
| AWS_S3_PUBLIC_URL | https://cdn.nexcommerce.com | (optional) | CDN (CloudFront) base URL for public assets. Falls back to S3 URL |
| CLOUDINARY_URL | cloudinary://... | (optional) | Only if image pipeline uses Cloudinary instead of S3-WebP worker |

---

## 9. Observability & Security

| Variable | Example Value | Required | Description |
| :--- | :--- | :---: | :--- |
| SENTRY_DSN | https://xxx@sentry.io/123 | Staging/prod only | Error tracking DSN. Omit locally to log to console |
| LOG_LEVEL | info | (optional, default `info`; `debug` dev, `warn` prod) | Pino log level: `debug` \| `info` \| `warn` \| `error` |
| DATADOG_API_KEY | xxx | (optional, prod) | Metrics/APM key if DataDog enabled |
| CORS_EXTRA_ORIGINS | https://admin.nexcommerce.com | (optional) | Additional CORS origins appended to `CLIENT_URL` |
| COOKIE_DOMAIN | .nexcommerce.com | (optional, prod) | Refresh-cookie domain for subdomains |
| ENCRYPTION_KEY | 32-byte-base64-... | Yes (prod) | AES-256/KMS data-key for PII fields at rest |
| HEALTH_CHECK_TOKEN | xxx | (optional) | Bearer for `/health/ready` detailed probe (K8s); `/health/live` stays public |

---

## 10. Feature Flags & Tuning (Optional)

| Variable | Example Value | Default | Description |
| :--- | :--- | :--- | :--- |
| ENABLE_SEMANTIC_SEARCH | true | `true` | Kill-switch → fallback to ES keyword search |
| ENABLE_RAG_CHATBOT | true | `true` | Kill-switch → disable chatbot UI |
| ENABLE_DYNAMIC_PRICING | false | `false` | Nightly pricing cron |
| ENABLE_FRAUD_CHECK | true | `true` | AI fraud scoring gate (`AI_FRAUD_REVIEW_REQUIRED`) |
| CACHE_TTL_DASHBOARD_SEC | 300 | `300` | Admin dashboard Redis TTL (FR-055) |
| CART_TTL_MIN | 15 | `15` | Cart/inventory-lock TTL (FR-018) |
| DRIVER_ACCEPT_TIMEOUT_SEC | 60 | `60` | Dispatch re-route window (FR-038) |

> Runtime-togglable flags live in DB + admin UI (`Admin Module`); env flags are boot-time defaults/overrides.

---

## 11. Environment-Specific Values

| Variable | Local | Staging | Production |
| :--- | :--- | :--- | :--- |
| NODE_ENV | development | staging | production |
| PORT | 5000 | 5000 | 5000 (ALB-mapped) |
| CLIENT_URL | http://localhost:3000 | https://staging.nexcommerce.com | https://app.nexcommerce.com |
| DATABASE_URL | localhost:5432 | RDS + PgBouncer (Secrets Manager) | RDS Multi-AZ + read replica |
| REDIS_URL | localhost:6379 | ElastiCache (TLS) | ElastiCache cluster (TLS) |
| ELASTICSEARCH_URL | http://localhost:9200 | OpenSearch staging domain | OpenSearch prod domain |
| STRIPE_SECRET_KEY | `sk_test_` | `sk_test_` (separate account) | `sk_live_` (Secrets Manager only) |
| LOG_LEVEL | debug | info | warn |
| SENTRY_DSN | — (omit) | staging DSN | prod DSN |

---

## 12. Validation & Boot Behavior

`src/config/env.ts` validates everything with Zod at import time. Missing/invalid REQUIRED var → log `ADMIN_CONFIG_INVALID`-style fatal + `process.exit(1)` (never boot half-configured).

```typescript
import { z } from 'zod';

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
  STRIPE_WEBHOOK_SECRET: z.string().startsWith('whsec_'),
});

export const env = envSchema.parse(process.env);
```

Health probes (`/health/live`, `/health/ready`) report DB/Redis/ES connectivity — misconfigured URLs surface there before traffic.

---

## 13. `.env.example` Template

Keep in repo root. Dummy values only — copy/paste safe:

```bash
# --- Server ---
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:3000
API_VERSION=v1

# --- Database & Search ---
DATABASE_URL=postgresql://nex:nexpass@localhost:5432/nexcommerce?schema=public
REDIS_URL=redis://localhost:6379
ELASTICSEARCH_URL=http://localhost:9200
CLICKHOUSE_URL=http://localhost:8123

# --- Auth ---
JWT_SECRET=local-dev-only-secret-min-32-chars!!
JWT_EXPIRES_IN=15m
REFRESH_SECRET=local-dev-only-refresh-min-32-chars!
REFRESH_EXPIRES_IN=7d
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxx

# --- AI ---
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o
PINECONE_API_KEY=xxx
PINECONE_INDEX=products
PINECONE_ENV=us-east-1

# --- Payments ---
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_CONNECT_CLIENT=ca_...

# --- Third Party ---
SENDGRID_API_KEY=SG.xxx
TWILIO_ACCOUNT_SID=ACxxx
TWILIO_AUTH_TOKEN=xxx
TWILIO_PHONE=+1555555555
FIREBASE_SERVER_KEY=xxx
GOOGLE_MAPS_KEY=AIza...
AWS_ACCESS_KEY=AKIA...
AWS_SECRET_KEY=xxx
AWS_BUCKET_NAME=my-bucket
AWS_REGION=ap-south-1
```

---

*Adding a variable? Update `.env.example` + this file + `src/config/env.ts` + `HEALTH_CHECK` if downstream. Never commit real secrets.*
