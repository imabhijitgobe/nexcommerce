# Error Codes Reference — NexCommerce

> **Version:** 1.0.0
> **Last Updated:** 2026-09-05
> **Status:** Active — Normative for all API modules
> **Related Docs:** [architecture.md](./architecture.md) · [prd.md](./prd.md) · [git-conventions.md](./git-conventions.md)

Single source of truth for machine-readable API error codes. All backend modules MUST use these codes. Frontend MUST branch on `code`, never on `message` (messages are human-readable and may be localized).

---

## Table of Contents

1. [Format & Numbering](#1-format--numbering)
2. [Standard Error Response Envelope](#2-standard-error-response-envelope)
3. [HTTP Status Mapping Rules](#3-http-status-mapping-rules)
4. [General Handling Rules](#4-general-handling-rules)
5. [Auth Errors (1xxx)](#5-auth-errors-1xxx)
6. [Product Errors (2xxx)](#6-product-errors-2xxx)
7. [Order Errors (3xxx)](#7-order-errors-3xxx)
8. [Vendor Errors (4xxx)](#8-vendor-errors-4xxx)
9. [AI Errors (5xxx)](#9-ai-errors-5xxx)
10. [User Errors (6xxx)](#10-user-errors-6xxx)
11. [Payment Errors (7xxx)](#11-payment-errors-7xxx)
12. [Delivery Errors (8xxx)](#12-delivery-errors-8xxx)
13. [Search Errors (9xxx)](#13-search-errors-9xxx)
14. [Review Errors (10xxx)](#14-review-errors-10xxx)
15. [Notification Errors (11xxx)](#15-notification-errors-11xxx)
16. [Analytics Errors (12xxx)](#16-analytics-errors-12xxx)
17. [Admin Errors (13xxx)](#17-admin-errors-13xxx)
18. [Common / Validation / System Errors (0xxx)](#18-common--validation--system-errors-0xxx)
19. [Adding a New Error Code](#19-adding-a-new-error-code)
20. [Backend Usage Example](#20-backend-usage-example)
21. [Frontend Handling Guide](#21-frontend-handling-guide)

---

## 1. Format & Numbering

Format: **MODULE_ERROR_DESCRIPTION**

```text
AUTH_INVALID_CREDENTIALS
ORDER_INVENTORY_FAILED
PAYMENT_WEBHOOK_SIGNATURE_INVALID
```

Rules:
1. `MODULE` = owning module in `SCREAMING_SNAKE_CASE` (`AUTH`, `PRODUCT`, `ORDER`, `VENDOR`, `AI`, `PAYMENT`, `DELIVERY`, `SEARCH`, `REVIEW`, `NOTIFICATION`, `ANALYTICS`, `ADMIN`, `USER`, `COMMON`, `VALIDATION`, `SYSTEM`).
2. `ERROR_DESCRIPTION` = short, specific, past-tense-safe: `NOT_FOUND`, `ALREADY_CANCELLED`, `TOKEN_EXPIRED`. Never generic `ERROR` / `FAILED` alone.
3. Codes are **stable, immutable**. Never rename or reuse a code. Deprecate, don't delete.
4. Numeric ranges (for logging / alerting buckets / Sentry grouping):

| Range | Module |
| :--- | :--- |
| 0xxx | Common / Validation / System |
| 1xxx | Auth |
| 2xxx | Product / Inventory / Category |
| 3xxx | Order / Cart / Checkout |
| 4xxx | Vendor / KYC / Store / Commission |
| 5xxx | AI (RAG, embeddings, pricing, fraud, moderation) |
| 6xxx | User / Address / Wishlist |
| 7xxx | Payment (Stripe, refunds, payouts) |
| 8xxx | Delivery / Drivers / Tracking |
| 9xxx | Search (ES + Pinecone) |
| 10xxx | Review / Ratings |
| 11xxx | Notification (Email/SMS/Push) |
| 12xxx | Analytics / Reports |
| 13xxx | Admin / Config / Audit |

---

## 2. Standard Error Response Envelope

Every error response MUST use this shape (Express error middleware enforces it):

```typescript
interface ApiErrorResponse {
  success: false;
  code: string;        // e.g. "AUTH_TOKEN_EXPIRED"
  message: string;     // human-readable, safe to display
  httpStatus: number;  // mirrors HTTP status
  requestId: string;   // X-Request-Id for log correlation
  details?: unknown;   // Zod field errors / validation breakdown (never secrets)
  retryable: boolean;  // whether client should retry
  timestamp: string;   // ISO-8601
}
```

Example:

```json
{
  "success": false,
  "code": "ORDER_INVENTORY_FAILED",
  "message": "One or more items went out of stock",
  "httpStatus": 400,
  "requestId": "req_9f3a2b1c",
  "details": { "sku": "HOODIE-RED-M", "available": 0 },
  "retryable": false,
  "timestamp": "2026-09-05T10:00:00.000Z"
}
```

Validation error example (Zod):

```json
{
  "success": false,
  "code": "VALIDATION_FAILED",
  "message": "Request validation failed",
  "httpStatus": 400,
  "requestId": "req_abc123",
  "details": [
    { "path": "email", "message": "Invalid email format" },
    { "path": "password", "message": "Must be at least 12 characters" }
  ],
  "retryable": false,
  "timestamp": "2026-09-05T10:00:00.000Z"
}
```

---

## 3. HTTP Status Mapping Rules

| HTTP | Meaning | When to use |
| :--- | :--- | :--- |
| 400 | Bad Request | Validation, malformed variant, cart state, business rule violation |
| 401 | Unauthorized | Missing/invalid/expired token. Client MUST try refresh, else force logout |
| 402 | Payment Required | Card declined, payment processing failed |
| 403 | Forbidden | Valid token but insufficient role, unverified email, suspended, pending KYC |
| 404 | Not Found | Entity does not exist (or hidden for privacy — e.g. other vendor's product) |
| 409 | Conflict | Duplicate email/SKU/slug, idempotency collision, version conflict |
| 422 | Unprocessable | Semantically invalid state transition (e.g. cancel delivered order) — use sparingly; default to 400 for business rules |
| 429 | Too Many Requests | Rate limit (auth 5/15min, AI per-user LLM quota, search burst) |
| 500 | Internal Error | Unhandled bug. Never leak stack to client |
| 502/503 | Bad Gateway / Unavailable | Downstream (Stripe, OpenAI, ES, Pinecone, Twilio) failure. `retryable: true` |

> Prefer `400` for business-rule violations (`ORDER_CANNOT_CANCEL`), `403` for permission/state gates (`VENDOR_NOT_APPROVED`), `404` only when the ID truly doesn't exist.

---

## 4. General Handling Rules

1. **Branch on `code`, not `message` or `httpStatus`.** Multiple codes share one HTTP status.
2. **`retryable` semantics:** `true` only for 429/502/503 + `AI_SERVICE_UNAVAILABLE`, `PAYMENT_GATEWAY_TIMEOUT`, `SEARCH_INDEX_UNAVAILABLE`. All 4xx except 429 are `retryable: false`.
3. **401 handling:** on `AUTH_TOKEN_EXPIRED` → silent refresh once → retry original request once → on `AUTH_REFRESH_INVALID` → force logout + redirect to login.
4. **403 handling:** show contextual CTA (verify email → resend link; KYC incomplete → onboarding; suspended → support).
5. **Idempotency:** on `ORDER_DUPLICATE_IDEMPOTENCY_KEY` return the original order, do not create a new one.
6. **Webhooks:** Stripe/webhook handlers MUST return 200 on duplicate (`PAYMENT_ALREADY_PROCESSED`) to stop retries.
7. **Logging:** log `code + requestId + userId + module` at warn (4xx) / error (5xx). Never log passwords, tokens, PAN, KYC docs.
8. **PII:** `details` MUST NOT contain passwords, full card numbers, refresh tokens, or presigned KYC URLs.

---

## 5. Auth Errors (1xxx)

| Code | HTTP | Message | Notes / Action |
| :--- | :---: | :--- | :--- |
| AUTH_INVALID_CREDENTIALS | 401 | Email or password is incorrect | Generic message (no user-enumeration). Rate-limited 5/15min |
| AUTH_TOKEN_EXPIRED | 401 | Access token has expired | Silent refresh once |
| AUTH_TOKEN_INVALID | 401 | Token is malformed or tampered | Force logout |
| AUTH_REFRESH_INVALID | 401 | Refresh token is invalid/expired | Force logout |
| AUTH_EMAIL_NOT_VERIFIED | 403 | Please verify your email first | CTA: resend verification |
| AUTH_ACCOUNT_SUSPENDED | 403 | Account has been suspended | Contact support. Revoke sessions |
| AUTH_INSUFFICIENT_ROLE | 403 | You don't have permission | Log unauthorized attempt. Check RBAC |
| AUTH_EMAIL_EXISTS | 409 | Email already registered | Suggest login / password reset |
| AUTH_OTP_INVALID | 400 | OTP is incorrect | Allow retry within attempt window |
| AUTH_OTP_EXPIRED | 400 | OTP has expired. Request a new one | CTA: resend OTP |
| AUTH_PASSWORD_WEAK | 400 | Password must be 12+ chars with upper, lower, number, special | FR-004 |
| AUTH_RATE_LIMITED | 429 | Too many attempts. Try again in 15 minutes | Login/reset endpoints |
| AUTH_SESSION_REVOKED | 401 | Session has been revoked. Please log in again | Admin ban / password change |
| AUTH_OAUTH_LINK_FAILED | 400 | Could not link OAuth account. Email already in use | Link by verified email |
| AUTH_MFA_REQUIRED | 401 | Multi-factor authentication required | Challenge step-up |

---

## 6. Product Errors (2xxx)

| Code | HTTP | Message | Notes / Action |
| :--- | :---: | :--- | :--- |
| PRODUCT_NOT_FOUND | 404 | Product does not exist | Also used for hidden cross-vendor access |
| PRODUCT_OUT_OF_STOCK | 400 | Product is currently out of stock | Show notify-me CTA |
| PRODUCT_INVALID_VARIANT | 400 | Selected variant doesn't exist | Invalid size/color combo |
| PRODUCT_UNAUTHORIZED | 403 | You don't own this product | Vendor isolation |
| PRODUCT_DUPLICATE_SKU | 409 | SKU already exists | Global SKU uniqueness (FR-017) |
| PRODUCT_INVENTORY_LOCK_FAILED | 409 | Could not reserve inventory. Try again | Redis lock contention, retryable once |
| PRODUCT_CATEGORY_INVALID | 400 | Invalid category selected | Bad category ID / hierarchy |
| PRODUCT_IMAGE_INVALID | 400 | Image must be JPG/PNG/WebP under 5MB | Pre-S3 validation |
| PRODUCT_BULK_IMPORT_FAILED | 422 | Bulk import failed. See error report | Background job report URL in `details` |
| PRODUCT_STATUS_INVALID | 400 | Product cannot be published in current state | e.g. missing price/images, vendor not active |

---

## 7. Order Errors (3xxx)

| Code | HTTP | Message | Notes / Action |
| :--- | :---: | :--- | :--- |
| ORDER_NOT_FOUND | 404 | Order does not exist | Scope to owner/vendor/admin |
| ORDER_ALREADY_CANCELLED | 400 | This order is already cancelled | Idempotent cancel |
| ORDER_CANNOT_CANCEL | 400 | Order cannot be cancelled now | Only `Pending` cancellable (FR-030) |
| ORDER_PAYMENT_FAILED | 402 | Payment processing failed | Offer retry with new intent, keep cart |
| ORDER_INVENTORY_FAILED | 400 | One or more items went out of stock | Show which SKUs in `details` |
| ORDER_CART_EMPTY | 400 | Your cart is empty | Cannot checkout |
| ORDER_CART_EXPIRED | 400 | Cart session expired. Please re-add items | Redis TTL 15min |
| ORDER_DUPLICATE_IDEMPOTENCY_KEY | 409 | Duplicate order request detected | Return original order, do not charge twice |
| ORDER_INVALID_STATE_TRANSITION | 400 | Order status cannot be changed this way | Enforce Pending→Paid→… state machine |
| ORDER_RETURN_WINDOW_EXPIRED | 400 | Return window (14 days) has expired | US-035 |
| ORDER_RETURN_NOT_ELIGIBLE | 400 | This order is not eligible for return | Must be `Delivered` |
| ORDER_SAGA_FAILED | 500 | Order processing failed. Support notified | Compensating tx triggered, alert on-call |

---

## 8. Vendor Errors (4xxx)

| Code | HTTP | Message | Notes / Action |
| :--- | :---: | :--- | :--- |
| VENDOR_NOT_APPROVED | 403 | Vendor account pending approval | Gate product creation / payouts |
| VENDOR_KYC_INCOMPLETE | 403 | Please complete KYC first | CTA: KYC onboarding |
| VENDOR_SUSPENDED | 403 | Vendor account is suspended | Contact support |
| VENDOR_PAYOUT_MINIMUM | 400 | Minimum payout amount is ₹500 | Stripe Connect threshold |
| VENDOR_NOT_FOUND | 404 | Vendor does not exist | — |
| VENDOR_STORE_SLUG_TAKEN | 409 | Store URL is already taken | Suggest alternative slug |
| VENDOR_STRIPE_ONBOARDING_INCOMPLETE | 403 | Complete Stripe Connect onboarding to activate store | FR-015 |
| VENDOR_COMMISSION_TIER_INVALID | 500 | Commission configuration error. Support notified | Misconfigured tier, alert admin |

---

## 9. AI Errors (5xxx)

| Code | HTTP | Message | Notes / Action |
| :--- | :---: | :--- | :--- |
| AI_SERVICE_UNAVAILABLE | 503 | AI service temporarily unavailable | Graceful fallback (standard search, disabled chatbot). `retryable: true` |
| AI_RATE_LIMIT | 429 | AI request limit reached | Per-user LLM quota (FR-057). Backoff + retry |
| AI_INVALID_IMAGE | 400 | Image format not supported | Supported: JPG/PNG/WebP |
| AI_EMBEDDING_FAILED | 503 | Could not generate search embedding | Fallback to keyword search |
| AI_MODERATION_FLAGGED | 422 | Content flagged by moderation. Under review | Toxicity > 0.8, hidden pending manual review |
| AI_CONTEXT_TOO_LONG | 400 | Request exceeds maximum context length | Truncate cart history / prompt |
| AI_PRICING_NO_SIGNAL | 422 | Insufficient market data for pricing suggestion | Pricing engine fallback to base price |
| AI_FRAUD_REVIEW_REQUIRED | 403 | Order flagged for manual review | High risk score, pause fulfillment, alert admin |

---

## 10. User Errors (6xxx)

| Code | HTTP | Message | Notes / Action |
| :--- | :---: | :--- | :--- |
| USER_NOT_FOUND | 404 | User does not exist | — |
| USER_ADDRESS_NOT_FOUND | 404 | Address does not exist | — |
| USER_ADDRESS_INVALID | 400 | Address is invalid or undeliverable | Geocoding failed |
| USER_DEFAULT_ADDRESS_REQUIRED | 400 | Exactly one default address is required | FR-008 |
| USER_AVATAR_TOO_LARGE | 400 | Avatar must be JPG/PNG under 2MB | US-011 |
| USER_PREFERENCES_INVALID | 400 | Invalid notification preferences | Unknown channel |
| USER_ALREADY_DELETED | 410 | Account has already been deleted | Soft-delete idempotency |
| USER_EXPORT_PENDING | 202 | Data export is being prepared | GDPR async job, poll/download link |

---

## 11. Payment Errors (7xxx)

| Code | HTTP | Message | Notes / Action |
| :--- | :---: | :--- | :--- |
| PAYMENT_INTENT_FAILED | 402 | Payment could not be initiated | Create new intent, keep cart |
| PAYMENT_CARD_DECLINED | 402 | Card was declined | Offer retry with different card |
| PAYMENT_INSUFFICIENT_FUNDS | 402 | Insufficient funds | — |
| PAYMENT_ALREADY_PROCESSED | 409 | Payment already processed | Webhook arriving before API response — return 200, upsert |
| PAYMENT_REFUND_FAILED | 502 | Refund could not be processed | Retry via Stripe dashboard, alert finance |
| PAYMENT_REFUND_NOT_ELIGIBLE | 400 | This payment cannot be refunded | Already refunded / outside window |
| PAYMENT_WEBHOOK_SIGNATURE_INVALID | 400 | Invalid webhook signature | Reject, log IP, alert security |
| PAYMENT_CURRENCY_UNSUPPORTED | 400 | Currency not supported | — |
| PAYMENT_FRAUD_HOLD | 403 | Payment held for fraud review | Stripe Radar / AI fraud (FR-035) |
| PAYMENT_GATEWAY_TIMEOUT | 504 | Payment gateway timed out. Check order status before retrying | `retryable: true`, check via idempotency key first |
| PAYMENT_PAYOUT_FAILED | 502 | Vendor payout failed | Retry Connect transfer, alert finance |

---

## 12. Delivery Errors (8xxx)

| Code | HTTP | Message | Notes / Action |
| :--- | :---: | :--- | :--- |
| DELIVERY_NOT_FOUND | 404 | Delivery job does not exist | — |
| DELIVERY_NO_DRIVERS | 503 | No delivery partners available nearby | Retry / rebroadcast. `retryable: true` |
| DELIVERY_ALREADY_ACCEPTED | 409 | Delivery already accepted by another partner | Refresh job board |
| DELIVERY_ASSIGNMENT_EXPIRED | 410 | Delivery assignment expired | 60s accept window (FR-038), re-routed |
| DELIVERY_LOCATION_STALE | 404 | Driver location unavailable | GPS lost, show last-known + ETA warning |
| DELIVERY_PROOF_REQUIRED | 400 | Photo or signature required to mark delivered | FR-039 |
| DELIVERY_CANNOT_REASSIGN | 400 | Delivery cannot be reassigned in current state | Only `Accepted`/`Picked Up` |
| DELIVERY_ROUTE_FAILED | 502 | Could not calculate route | Maps API failure, degraded ETA |

---

## 13. Search Errors (9xxx)

| Code | HTTP | Message | Notes / Action |
| :--- | :---: | :--- | :--- |
| SEARCH_INDEX_UNAVAILABLE | 503 | Search temporarily unavailable. Try again | ES down. `retryable: true` |
| SEARCH_QUERY_TOO_SHORT | 400 | Search query must be at least 2 characters | Autocomplete needs 3+ chars |
| SEARCH_FILTER_INVALID | 400 | One or more filters are invalid | Bad facet/price range |
| SEARCH_VECTOR_FALLBACK | 200 | Semantic search unavailable. Showing keyword results | Not an error to user — log + degrade (override `success: true`, include `warning` field) |
| SEARCH_SYNC_LAG | 200 | New products may not appear immediately | Index lag warning, `success: true` |

---

## 14. Review Errors (10xxx)

| Code | HTTP | Message | Notes / Action |
| :--- | :---: | :--- | :--- |
| REVIEW_NOT_FOUND | 404 | Review does not exist | — |
| REVIEW_NOT_ELIGIBLE | 403 | Only verified buyers can review this product | Must have `Delivered` order (FR-046) |
| REVIEW_ALREADY_SUBMITTED | 409 | You have already reviewed this product | One review per order-item |
| REVIEW_RATING_INVALID | 400 | Rating must be between 1 and 5 | — |
| REVIEW_FLAGGED_TOXIC | 422 | Review flagged for moderation | Hidden pending admin review |
| REVIEW_VOTE_DUPLICATE | 409 | You have already voted on this review | Idempotent helpful-vote |

---

## 15. Notification Errors (11xxx)

| Code | HTTP | Message | Notes / Action |
| :--- | :---: | :--- | :--- |
| NOTIFICATION_CHANNEL_DISABLED | 400 | This notification channel is disabled for your account | Respect prefs (FR-041), offer opt-in |
| NOTIFICATION_TEMPLATE_NOT_FOUND | 500 | Notification template error. Support notified | Missing Handlebars template, alert |
| NOTIFICATION_PROVIDER_FAILED | 502 | Notification could not be delivered. Will retry | BullMQ exponential backoff ×3 |
| NOTIFICATION_DEVICE_TOKEN_INVALID | 400 | Push device token is invalid or expired | Re-register FCM token |
| NOTIFICATION_UNSUBSCRIBED | 403 | You have unsubscribed from these emails | One-click resubscribe CTA |

---

## 16. Analytics Errors (12xxx)

| Code | HTTP | Message | Notes / Action |
| :--- | :---: | :--- | :--- |
| ANALYTICS_QUERY_INVALID | 400 | Invalid date range or metric | — |
| ANALYTICS_TENANT_FORBIDDEN | 403 | You can only access your own analytics | Enforce `vendor_id` isolation (FR-053) |
| ANALYTICS_EXPORT_TOO_LARGE | 422 | Report too large. Narrow the date range | Async CSV via background job |
| ANALYTICS_REPORT_PENDING | 202 | Report is being generated | Poll `ReportGenerated` / download link |
| ANALYTICS_SERVICE_DEGRADED | 503 | Analytics temporarily unavailable | Never block checkout — degrade silently |

---

## 17. Admin Errors (13xxx)

| Code | HTTP | Message | Notes / Action |
| :--- | :---: | :--- | :--- |
| ADMIN_FORBIDDEN | 403 | Admin access required | Superadmin vs admin role check |
| ADMIN_USER_ALREADY_BANNED | 409 | User is already banned | Idempotent ban |
| ADMIN_CONFIG_INVALID | 400 | Invalid configuration value | e.g. negative commission % |
| ADMIN_IMPERSONATION_DENIED | 403 | Impersonation not allowed for this account | Audit-logged, superadmin only |
| ADMIN_AUDIT_IMMUTABLE | 403 | Audit logs cannot be modified or deleted | Append-only table (FR-063) |
| ADMIN_FEATURE_FLAG_NOT_FOUND | 404 | Feature flag does not exist | — |

---

## 18. Common / Validation / System Errors (0xxx)

| Code | HTTP | Message | Notes / Action |
| :--- | :---: | :--- | :--- |
| VALIDATION_FAILED | 400 | Request validation failed | Zod errors in `details` |
| UNAUTHORIZED | 401 | Authentication required | Missing token |
| FORBIDDEN | 403 | Access denied | Fallback when no specific code fits |
| NOT_FOUND | 404 | Resource not found | Fallback for unscoped 404s |
| CONFLICT | 409 | Resource conflict | Fallback for unscoped 409s |
| RATE_LIMITED | 429 | Too many requests. Slow down | Token-bucket per role |
| INTERNAL_ERROR | 500 | Something went wrong. Support notified | Log full stack server-side, `requestId` to user |
| SERVICE_UNAVAILABLE | 503 | Service temporarily unavailable | `retryable: true` |
| GATEWAY_TIMEOUT | 504 | Upstream timed out | `retryable: true` after status check |
| MAINTENANCE_MODE | 503 | Platform under scheduled maintenance | Include `retryAfter` in `details` |

---

## 19. Adding a New Error Code

1. Pick the owning module + next free number in its range. Never reuse.
2. Name it `MODULE_SPECIFIC_REASON` (SCREAMING_SNAKE, no generic `ERROR`).
3. Assign the narrowest correct HTTP status (§3). Default 400 for business rules, 403 for gates, 404 for missing.
4. Set `retryable` (true ONLY for 429/502/503/504).
5. Add row to the table above + register in `src/common/errors/codes.ts` + map in error middleware.
6. Add a unit test asserting `code + httpStatus + retryable`.
7. PR must reference this file change (`docs(api): add <CODE>`).

```typescript
// src/common/errors/codes.ts
export const ErrorCodes = {
  ORDER_INVENTORY_FAILED: { httpStatus: 400, message: 'One or more items went out of stock', retryable: false },
  // ... keep alphabetical per module
} as const;
```

---

## 20. Backend Usage Example

```typescript
import { AppError } from '@/common/errors/AppError';

// Throwing — middleware formats to ApiErrorResponse
throw new AppError('ORDER_INVENTORY_FAILED', { sku: 'HOODIE-RED-M', available: 0 });

// Auth guard
if (!payload.sub) throw new AppError('AUTH_TOKEN_INVALID');

// Idempotent webhook — return 200, don't throw
if (await payments.isProcessed(event.id))
  return res.status(200).json({ success: true, code: 'PAYMENT_ALREADY_PROCESSED' });

// AppError renders: { success:false, code, message, httpStatus, requestId, details, retryable, timestamp }
```

Middleware MUST: attach `X-Request-Id`, translate Zod errors → `VALIDATION_FAILED`, Prisma `P2002` → `*_CONFLICT`/`*_EXISTS`, hide 500 stacks, emit `error.code` metric for dashboards.

---

## 21. Frontend Handling Guide

```typescript
// Branch on code — never on message
async function checkout() {
  try { await api.post('/orders/checkout', cart, { idempotencyKey }); }
  catch (e: ApiError) {
    switch (e.code) {
      case 'AUTH_TOKEN_EXPIRED': await refreshAndRetry(); break;
      case 'AUTH_REFRESH_INVALID': forceLogout(); break;
      case 'ORDER_INVENTORY_FAILED': showOutOfStock(e.details); break;
      case 'ORDER_PAYMENT_FAILED': keepCartAndOfferRetry(); break;
      case 'AI_SERVICE_UNAVAILABLE': showKeywordResultsFallback(); break;
      case 'VENDOR_KYC_INCOMPLETE': goTo('/vendor/onboarding'); break;
      default: toast(e.message, { requestId: e.requestId });
    }
  }
}
```

UX rules: surface `message` directly for 4xx; for 5xx show generic "Something went wrong (Ref: `requestId`)" + retry button if `retryable`. Always offer the contextual CTA from the tables above.

---

*New codes require updating this file + `codes.ts` + tests in the same PR. Questions? Open an issue labeled `error-codes`.*
