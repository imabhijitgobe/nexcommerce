# API Documentation — NexCommerce

> **Version:** 1.0.0
> **Last Updated:** 2026-09-05
> **Status:** Active — Normative for frontend + backend
> **Related Docs:** [architecture.md](./architecture.md) · [prd.md](./prd.md) · [error-codes.md](./error-codes.md) · [env.md](./env.md) · [ui-flows.md](./ui-flows.md)

Complete reference for every REST endpoint. If an endpoint is not documented here, the frontend MUST NOT call it and the backend MUST NOT ship it without updating this file in the same PR.

---

## Table of Contents

1. [Base URL](#1-base-url)
2. [Authentication](#2-authentication)
3. [Standard Response Format](#3-standard-response-format)
4. [Global Conventions](#4-global-conventions)
5. [Auth Module](#5-auth-module)
6. [User Module](#6-user-module)
7. [Vendor Module](#7-vendor-module)
8. [Product Module](#8-product-module)
9. [Search Module](#9-search-module)
10. [Order and Cart Module](#10-order-and-cart-module)
11. [Payment Module](#11-payment-module)
12. [Delivery Module](#12-delivery-module)
13. [Notification Module](#13-notification-module)
14. [Review Module](#14-review-module)
15. [Analytics Module](#15-analytics-module)
16. [AI Module](#16-ai-module)
17. [Admin Module](#17-admin-module)
18. [Webhooks](#18-webhooks)
19. [Rate Limits](#19-rate-limits)
20. [Error Code Index](#20-error-code-index)

---

## 1. Base URL

- Development: http://localhost:5000/api/v1
- Production: https://api.yourapp.com/api/v1

```text
Development: http://localhost:5000/api/v1
Production:  https://api.yourapp.com/api/v1
```

- All paths below are relative to the base URL, e.g. `POST /auth/register` means `POST http://localhost:5000/api/v1/auth/register` locally.
- Version prefix `v1` comes from `API_VERSION` (see env.md). Breaking changes require `v2`, never silently change `v1`.
- Health (unversioned, no auth): `GET /health/live`, `GET /health/ready`.

---

## 2. Authentication

- All protected routes require: Authorization: Bearer {JWT_TOKEN}
- Refresh endpoint: POST /auth/refresh

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
X-Request-Id: req_9f3a2b1c
X-Idempotency-Key: 550e8400-e29b-41d4-a716-446655440000
```

Rules:

- Access token: short-lived JWT, 15m (`JWT_EXPIRES_IN`), HMAC-SHA256, claims `sub`, `role`, `sessionId`, `permissions`.
- Refresh token: 7d (`REFRESH_EXPIRES_IN`), HTTP-only Secure cookie + body fallback for native apps.
- Flow: on `401 AUTH_TOKEN_EXPIRED`, call `POST /auth/refresh` once, retry original once. On `401 AUTH_REFRESH_INVALID`, force logout.
- Roles: `customer`, `vendor`, `driver`, `admin`, `superadmin`. Tables below use `Auth` column: `No` = public, `Yes` = any authed user, `Vendor` / `Driver` / `Admin` = role-gated (else `403 AUTH_INSUFFICIENT_ROLE`).
- Vendor write actions additionally require vendor status `Active` (else `403 VENDOR_NOT_APPROVED` / `VENDOR_KYC_INCOMPLETE`).
- Every admin action is audit-logged (append-only).

---

## 3. Standard Response Format

### Success

```json
{
  "success": true,
  "data": { "...": "..." },
  "message": "Operation successful",
  "pagination": {
    "nextCursor": "eyJpZCI6IjEyMyJ9",
    "hasMore": true,
    "total": 250
  }
}
```

- `data`: object or array (the resource).
- `message`: human-readable, safe to toast. Omit for hot paths if needed.
- `pagination`: ONLY for list endpoints (cursor-based). `nextCursor` opaque, pass as `?cursor=`. `total` may be omitted for huge streams.

### Error

Canonical envelope (matches error-codes.md). The short form from early drafts (`error.code`, `error.statusCode`) maps as `code` and `httpStatus` below — always branch on `code`.

```json
{
  "success": false,
  "code": "PRODUCT_NOT_FOUND",
  "message": "Product with given ID does not exist",
  "httpStatus": 404,
  "requestId": "req_9f3a2b1c",
  "details": null,
  "retryable": false,
  "timestamp": "2026-09-05T10:00:00.000Z"
}
```

- `code`: stable `MODULE_REASON` (e.g. `AUTH_TOKEN_EXPIRED`). Never branch on `message`.
- `httpStatus`: mirrors HTTP status.
- `requestId`: send back in support tickets (`X-Request-Id` header echoes it).
- `details`: Zod field errors or context (e.g. `{ "sku": "HOODIE-RED-M", "available": 0 }`). Never secrets.
- `retryable`: true only for 429/502/503/504 (retry with backoff).

Validation failure example:

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

## 4. Global Conventions

### 4.1 Headers

| Header | Required | Purpose |
| :--- | :---: | :--- |
| `Authorization: Bearer <jwt>` | protected only | access token |
| `X-Request-Id` | optional (server generates if absent) | log correlation, returned in body + header |
| `X-Idempotency-Key` | required on `POST /orders/checkout`, `POST /payments/intent/retry` | UUID v4, prevents double orders/charges |
| `Content-Type: application/json` | POST/PUT/PATCH | JSON bodies (except multipart uploads) |

### 4.2 Pagination (cursor)

```http
GET /products?limit=20&cursor=eyJpZCI6IjEyMyJ9&sort=newest
```

- Query: `?limit=1..100 (default 20)` + `?cursor=<opaque>` + module filters/sort.
- Response: `data[]` + `pagination { nextCursor, hasMore, total? }`.
- Applies to: products, search, orders, reviews, vendors, payouts, audit, notifications.

### 4.3 Conventions per request type

- `POST` create (201 on success), `GET` read (200), `PUT` full replace, `PATCH` partial, `DELETE` (200 + `{ deleted: true }` or 204).
- Money: integers in paise/cents. Dates: ISO-8601 UTC. IDs: UUID v4 (orders, users) or cuid (products ok).
- Uploads: `multipart/form-data` field `files[]`, max 5MB/file JPG/PNG/WebP. Response gives S3/CDN URLs + WebP variants.
- Filtering: `?status=`, `?category=`, `?min=&max=&brand=&rating=` per endpoint; unknown params ignored (log warn).
- Response `message` always present on mutations, optional on GETs.

Example list envelope:

```json
{
  "success": true,
  "data": [{ "id": "prod_1", "title": "Headphones Pro" }],
  "pagination": { "nextCursor": "cursor_abc", "hasMore": true, "total": 250 }
}
```

---

## 5. Auth Module

| Method | Endpoint | Auth | Description |
| :--- | :--- | :---: | :--- |
| POST | /auth/register | No | Register new user |
| POST | /auth/login | No | Login with email/password |
| POST | /auth/refresh | No | Refresh access token |
| POST | /auth/logout | Yes | Invalidate refresh token |
| GET | /auth/google | No | Google OAuth redirect |
| POST | /auth/verify-otp | No | Verify phone OTP |
| POST | /auth/forgot-password | No | Send reset email |
| POST | /auth/reset-password | No | Reset with token |
| GET | /auth/me | Yes | Current session + role |
| POST | /auth/verify-email | No | Verify email link |
| POST | /auth/oauth/:provider/callback | No | OAuth code exchange (google, facebook) |

### POST /auth/register

Request Body:

```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "phone": "+91-9999999999",
  "role": "customer",
  "name": "John Doe"
}
```

- `role`: `customer` (default) | `vendor` | `driver`. `admin` cannot self-register.
- Password policy (FR-004): min 12 chars, upper + lower + number + special.

Success Response (201):

```json
{
  "success": true,
  "data": {
    "user": { "id": "uuid", "email": "user@example.com", "role": "customer" },
    "accessToken": "eyJhbGci...",
    "refreshToken": "eyJhbGci..."
  },
  "message": "Registered. Verification email sent."
}
```

Error Responses:

- 400: VALIDATION_FAILED — Invalid email format
- 400: AUTH_PASSWORD_WEAK — Password policy failed
- 409: AUTH_EMAIL_EXISTS — Email taken (body shows `code: AUTH_EMAIL_EXISTS`)
- 429: AUTH_RATE_LIMITED — Too many attempts (5/15min per IP)

```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"email":"user@example.com","password":"SecurePass123!","name":"John Doe","role":"customer"}'
```

### POST /auth/login

```json
{ "email": "user@example.com", "password": "SecurePass123!" }
```

- Success 200: same shape as register + `expiresIn: 900`. Merges anonymous cart (FR-026).
- Errors: `401 AUTH_INVALID_CREDENTIALS` (generic, no enumeration), `403 AUTH_ACCOUNT_SUSPENDED`, `403 AUTH_EMAIL_NOT_VERIFIED` (with `resendLink` hint), `429 AUTH_RATE_LIMITED`.

### POST /auth/refresh

```json
{ "refreshToken": "eyJhbGci..." }
```

- Reads from body OR HTTP-only cookie. Success 200 rotates both tokens (reuse detected = revoke all sessions).
- Errors: `401 AUTH_REFRESH_INVALID`, `401 AUTH_SESSION_REVOKED`.

### POST /auth/logout

- Auth Yes. Body `{ "refreshToken": "..." }` optional (cookie otherwise). Success 200 revokes session in Redis.
- Emits nothing; `UserBanned` consumed elsewhere revokes all sessions.

### GET /auth/google

- 302 redirect to Google consent. Callback: `POST /auth/oauth/google/callback { "code": "..." }` exchanges, links by verified email (FR-002), issues JWT pair (US-003).
- Errors: `400 AUTH_OAUTH_LINK_FAILED` (email in use, log in to link).

### POST /auth/verify-otp

```json
{ "phone": "+91-9999999999", "otp": "482913" }
```

- Success 200 marks phone verified. Errors: `400 AUTH_OTP_INVALID` (retry, 5 attempts), `400 AUTH_OTP_EXPIRED` (request new), `429 AUTH_RATE_LIMITED`.

### POST /auth/forgot-password

```json
{ "email": "user@example.com" }
```

- Always 200 `"If account exists, link sent"` (no enumeration). Rate-limited. Link TTL from `EMAIL_VERIFICATION_TTL`.

### POST /auth/reset-password

```json
{ "token": "reset_xxx", "password": "NewSecure123!" }
```

- Success 200 revokes all sessions + auto-login. Errors: `400 VALIDATION_FAILED`, `401 AUTH_TOKEN_INVALID` (bad/expired token).

### GET /auth/me

- Auth Yes. 200 `{ user: { id, email, role, emailVerified, phoneVerified } }`. Errors: `401 AUTH_TOKEN_EXPIRED/INVALID`.

### POST /auth/verify-email

```json
{ "token": "verify_xxx" }
```

- Success 200 marks verified. Errors: `400 AUTH_OTP_EXPIRED` (resend), `401 AUTH_TOKEN_INVALID`.

---

## 6. User Module

| Method | Endpoint | Auth | Description |
| :--- | :--- | :---: | :--- |
| GET | /users/me | Yes | Get own profile |
| PUT | /users/me | Yes | Update profile |
| POST | /users/me/avatar | Yes | Upload avatar (multipart, 2MB) |
| GET | /users/me/addresses | Yes | List addresses |
| POST | /users/me/addresses | Yes | Add address (geocoded async) |
| PUT | /users/me/addresses/:id | Yes | Update address |
| DELETE | /users/me/addresses/:id | Yes | Delete (logical) address |
| GET | /users/me/preferences | Yes | Get prefs |
| PUT | /users/me/preferences | Yes | Update prefs (channels) |
| GET | /users/me/wishlist | Yes | List wishlist |
| POST | /users/me/wishlist | Yes | Add to wishlist |
| DELETE | /users/me/wishlist/:productId | Yes | Remove from wishlist |
| POST | /users/me/export | Yes | GDPR data export (async) |
| DELETE | /users/me | Yes | Soft-delete + anonymize |

### GET /users/me

- 200 `{ id, email, firstName, lastName, phone, avatarUrl, defaultAddressId }`. Errors: `401 UNAUTHORIZED`, `404 USER_NOT_FOUND`.

### PUT /users/me

```json
{ "firstName": "Priya", "lastName": "S", "phone": "+91-9999999999" }
```

- 200 updated profile. Errors: `400 VALIDATION_FAILED`.

### POST /users/me/avatar

- Multipart `avatar` JPG/PNG <=2MB. 200 `{ avatarUrl }`. Uploads to S3 public prefix. Errors: `400 USER_AVATAR_TOO_LARGE`.

### GET /users/me/addresses

- 200 array with `isDefault`, `lat/lng` (geocoded FR-007). Exactly one default if any exist (FR-008).

### POST /users/me/addresses

```json
{ "label": "Home", "street": "123 MG Road", "city": "Bengaluru", "pin": "560001", "isDefault": true }
```

- 201 address (geocode queued). Errors: `400 USER_ADDRESS_INVALID`, `400 USER_DEFAULT_ADDRESS_REQUIRED`.

### PUT /users/me/addresses/:id, DELETE /users/me/addresses/:id

- 200 updated / `{ deleted: true }` (logical delete; default reassigned). Errors: `404 USER_ADDRESS_NOT_FOUND`.

### GET /users/me/preferences, PUT /users/me/preferences

```json
{ "email": true, "sms": false, "push": true, "marketing": false }
```

- PUT 200 saved. Drives Notification fan-out. Errors: `400 USER_PREFERENCES_INVALID`.

### GET /users/me/wishlist, POST /users/me/wishlist, DELETE /users/me/wishlist/:productId

```json
{ "productId": "prod_123" }
```

- POST 201, DELETE 200. Errors: `404 PRODUCT_NOT_FOUND`.

### POST /users/me/export, DELETE /users/me

- Export 202 `{ jobId, downloadUrl?: null }` (`USER_EXPORT_PENDING` while preparing, GDPR).
- Delete 200 soft-deletes + anonymizes orders. Second call `410 USER_ALREADY_DELETED`.

---

## 7. Vendor Module

| Method | Endpoint | Auth | Description |
| :--- | :--- | :---: | :--- |
| POST | /vendors/register | Yes | Register vendor (Pending) |
| POST | /vendors/kyc | Vendor | Upload KYC docs (private S3) |
| GET | /vendors/me | Vendor | Own vendor + status |
| PUT | /vendors/me/store | Vendor | Update store profile |
| GET | /vendors/me/commission | Vendor | Current commission tier |
| GET | /vendors/me/dashboard | Vendor | KPIs (sales, orders, top) |
| GET | /vendors/slug-check | No | Check store slug availability |
| GET | /store/:slug | No | Public storefront |

### POST /vendors/register

```json
{ "businessName": "Raj Electronics", "gst": "29ABCDE1234F1Z5", "phone": "+91-9999999999" }
```

- 201 `{ vendorId, status: "Pending" }`. Starts state machine Pending > In Review > Active (FR-011).

### POST /vendors/kyc

- Multipart `docs[]` PDF/Image. 200 `{ status: "In Review" }`. Stored private S3, presigned 15m (FR-012). Errors: `403 VENDOR_NOT_APPROVED` if wrong state.

### GET /vendors/me

- 200 `{ vendorId, status, store, commissionTier }`. Errors: `404 VENDOR_NOT_FOUND`.

### PUT /vendors/me/store

```json
{ "storeName": "Raj Electronics", "description": "...", "logoUrl": "https://...", "returnPolicy": "..." }
```

- 200 store profile. Slug auto-generated unique (409 `VENDOR_STORE_SLUG_TAKEN`). Errors: `403 VENDOR_NOT_APPROVED` before Active.

### GET /vendors/me/commission

- 200 `{ tier, percent, effectiveFrom }`. Misconfig `500 VENDOR_COMMISSION_TIER_INVALID`.

### GET /vendors/me/dashboard

- Query `?range=7d`. 200 `{ totalSales, orderCount, topProducts[], conversionRate }`. Tenant-isolated.

### GET /vendors/slug-check?slug=raj-electronics

- 200 `{ available: true }` or 409-style `{ available: false, suggestion: "raj-electronics-2" }`.

---

## 8. Product Module

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| GET | /products | No | List products |
| GET | /products/:id | No | Get single product |
| POST | /products | Vendor | Create product |
| PUT | /products/:id | Vendor | Update product |
| DELETE | /products/:id | Vendor | Delete product |
| GET | /products/:id/similar | No | AI similar products |
| POST | /products/:id/generate-desc | Vendor | AI generate description |
| POST | /products/:id/images | Vendor | Upload images (WebP pipeline) |
| GET | /categories | No | Category tree |
| POST | /categories | Admin | Create category |
| PUT | /inventory/:sku | Vendor | Update stock (ledger) |
| GET | /inventory/transactions | Vendor | Stock ledger |
| POST | /products/bulk-import | Vendor | CSV import (async job) |
| GET | /products/bulk-import/:jobId | Vendor | Import status + error CSV |

### GET /products

```http
GET /products?category=electronics&min=1000&max=50000&brand=sony&rating=4&sort=newest&limit=20&cursor=xxx
```

- 200 list + pagination + facets. Errors: `400 PRODUCT_CATEGORY_INVALID` on bad category.

### GET /products/:id

- 200 full product with variants, assets, rating, price history. Errors: `404 PRODUCT_NOT_FOUND` (also for cross-vendor hidden).

### POST /products (Vendor, Active only)

```json
{
  "title": "Headphones Pro",
  "categoryId": "cat_electronics",
  "basePrice": 499900,
  "variants": [{ "attributes": { "color": "black" }, "priceAdjustment": 0, "stockQty": 50, "sku": "HP-BLK" }],
  "description": "..."
}
```

- Prices in paise. SKU globally unique (FR-017). 201 product. Emits `ProductCreated` (ES+Pinecone index).
- Errors: `403 VENDOR_NOT_APPROVED`, `409 PRODUCT_DUPLICATE_SKU`, `400 PRODUCT_INVALID_VARIANT`, `400 PRODUCT_STATUS_INVALID`.

### PUT /products/:id, DELETE /products/:id

- PUT 200 updated (emits `ProductUpdated` re-index). DELETE 200 logical delete (emits remove from index). Errors: `403 PRODUCT_UNAUTHORIZED` (not owner), `404 PRODUCT_NOT_FOUND`.

### GET /products/:id/similar

- 200 array from embeddings. Fallback keyword on AI down.

### POST /products/:id/generate-desc (Vendor)

```json
{ "title": "Headphones Pro", "features": ["ANC", "40h battery"] }
```

- 200 `{ description }` streamed or JSON (GPT-4o SEO). Errors: `503 AI_SERVICE_UNAVAILABLE`.

### POST /products/:id/images (Vendor)

- Multipart `files[]`. 200 `[{ url, thumb, medium, large }]`. Converts to WebP 3 sizes (FR-019). Errors: `400 PRODUCT_IMAGE_INVALID`.

### GET /categories, POST /categories (Admin)

- GET 200 tree (adjacency/materialized path FR-020). POST 201 `{ id, name, parentId }`.

### PUT /inventory/:sku (Vendor)

```json
{ "delta": -2, "reason": "sale-adjust" }
```

- 200 `{ sku, stockQty }`. Writes ledger. Errors: `409 PRODUCT_INVENTORY_LOCK_FAILED` on contention.

### POST /products/bulk-import (Vendor)

- Multipart CSV. 202 `{ jobId }`. Poll `GET /products/bulk-import/:jobId` for `done` + `errorCsvUrl`. Errors: `422 PRODUCT_BULK_IMPORT_FAILED`.

---

## 9. Search Module

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| GET | /search | No | Hybrid keyword + semantic search |
| GET | /search/semantic | No | Pure vector search |
| GET | /search/suggest | No | Autocomplete (3+ chars) |
| POST | /search/index | Admin | Force reindex product |

### GET /search

```http
GET /search?q=warm+winter+jacket&min=1000&max=8000&brand=&rating=4&cat=apparel&sort=relevance&limit=20&cursor=xxx
```

- Combines BM25 + cosine with weights (FR-023), returns facets (FR-024), cursor pages (FR-025).
- 200 `{ hits[], facets, pagination, warning? }`. `warning: SEARCH_VECTOR_FALLBACK` when Pinecone down (still `success: true`).
- Errors: `400 SEARCH_QUERY_TOO_SHORT`, `400 SEARCH_FILTER_INVALID`, `503 SEARCH_INDEX_UNAVAILABLE` (retryable).

### GET /search/semantic

- Same without BM25. Requires embeddings (`text-embedding-3-small` FR-022). Errors: `503 AI_EMBEDDING_FAILED` (fallback keyword).

### GET /search/suggest?q=hea

- 200 `{ suggestions: ["headphones", ...], products: [...] }`. Min 3 chars.

---

## 10. Order and Cart Module

| Method | Endpoint | Auth | Description |
| :--- | :--- | :---: | :--- |
| GET | /cart | Yes | Get cart (Redis) |
| POST | /cart | Yes | Add item (locks inventory 15m) |
| PUT | /cart/:sku | Yes | Update qty |
| DELETE | /cart/:sku | Yes | Remove item |
| POST | /cart/merge | Yes | Merge anonymous cart |
| POST | /orders/checkout | Yes | Create order + start saga (idempotency) |
| GET | /orders | Yes | Own order history (paginated) |
| GET | /orders/:id | Yes | Order detail |
| POST | /orders/:id/cancel | Yes | Cancel (Pending only) |
| POST | /orders/:id/return | Yes | Return request (<14d Delivered) |
| POST | /orders/:id/reorder | Yes | Re-add items to cart |

### GET /cart, POST /cart

```json
{ "sku": "HP-BLK", "qty": 1 }
```

- Cart in Redis, TTL 15m (FR-018/026). POST 200 cart. Errors: `400 PRODUCT_OUT_OF_STOCK`, `409 PRODUCT_INVENTORY_LOCK_FAILED`, `400 PRODUCT_INVALID_VARIANT`.

### POST /orders/checkout (idempotency REQUIRED)

```http
POST /orders/checkout
X-Idempotency-Key: 550e8400-e29b-41d4-a716-446655440000
Content-Type: application/json

{ "addressId": "addr_1", "paymentMethod": "card" }
```

- Creates order `Pending`, locks inventory, calcs tax/shipping, creates Stripe intent, returns `{ order, clientSecret }`. Starts saga (FR-027).
- 201 on first key; same key returns ORIGINAL 200 (`ORDER_DUPLICATE_IDEMPOTENCY_KEY`, no double charge).
- Errors: `400 ORDER_CART_EMPTY`, `400 ORDER_CART_EXPIRED`, `400 ORDER_INVENTORY_FAILED` (details list dead SKUs), `402 ORDER_PAYMENT_FAILED`.

### GET /orders, GET /orders/:id

- `GET /orders?status=&limit=&cursor=` 200 history. Scoped to owner (vendor uses `/vendor/orders`, admin `/admin/orders`).

### POST /orders/:id/cancel

```json
{ "reason": "changed mind" }
```

- Pending only. 200 Cancelled + inventory released + refund queued. Errors: `400 ORDER_CANNOT_CANCEL`, `400 ORDER_ALREADY_CANCELLED` (idempotent).

### POST /orders/:id/return

```json
{ "reason": "faulty", "photos": ["https://..."] }
```

- Delivered <14d only (US-035). 200 `ReturnRequested`. Errors: `400 ORDER_RETURN_NOT_ELIGIBLE`, `400 ORDER_RETURN_WINDOW_EXPIRED`.

---

## 11. Payment Module

| Method | Endpoint | Auth | Description |
| :--- | :--- | :---: | :--- |
| POST | /payments/intent | Yes | Create Stripe PaymentIntent |
| POST | /payments/intent/retry | Yes | New intent for failed order (same scope) |
| GET | /payments/:orderId | Yes | Payment status for order |
| POST | /payments/refund | Vendor/Admin | Full/partial refund |
| POST | /payments/payout | Vendor | Trigger Connect payout |
| GET | /payments/history | Admin | All transactions (paginated) |
| POST | /webhooks/stripe | No | Stripe webhook (raw body, signature) |

### POST /payments/intent

```json
{ "orderId": "ord_123" }
```

- 200 `{ clientSecret }` (destination charges split platform/vendor FR-032). Errors: `402 PAYMENT_INTENT_FAILED`, `409 PAYMENT_ALREADY_PROCESSED`.

### POST /payments/refund (Vendor for own, Admin any)

```json
{ "orderId": "ord_123", "amount": 199900 }
```

- Omitted amount = full. Auto-adjusts commission (FR-033). 200 `{ refundId, status }`. Errors: `400 PAYMENT_REFUND_NOT_ELIGIBLE`, `502 PAYMENT_REFUND_FAILED`.

### POST /payments/payout (Vendor)

```json
{ "amount": 50000 }
```

- Paise, min Rs 500 (`VENDOR_PAYOUT_MINIMUM`). 200 transfer. Errors: `403 VENDOR_STRIPE_ONBOARDING_INCOMPLETE`, `502 PAYMENT_PAYOUT_FAILED`.

### POST /webhooks/stripe

- Headers `Stripe-Signature`, raw body (no JSON parse). MUST verify `STRIPE_WEBHOOK_SECRET` (`400 PAYMENT_WEBHOOK_SIGNATURE_INVALID` on fail, log IP).
- Out-of-order arrival handled via upsert/lock (FR-031). Duplicate returns 200 `PAYMENT_ALREADY_PROCESSED` to stop retries.

---

## 12. Delivery Module

| Method | Endpoint | Auth | Description |
| :--- | :--- | :---: | :--- |
| GET | /delivery/jobs | Driver | Nearby jobs (5km PostGIS) |
| POST | /delivery/:id/accept | Driver | Accept (first wins) |
| POST | /delivery/:id/location | Driver | GPS update (also WS) |
| POST | /delivery/:id/status | Driver | Picked Up / In Transit / Arrive |
| POST | /delivery/:id/proof | Driver | Photo/signature (required) |
| POST | /delivery/:id/reassign | Driver/System | Rebroadcast |
| GET | /delivery/earnings | Driver | Trips + payouts |
| GET | /deliveries | Yes | Customer: own delivery by orderId |

### GET /delivery/jobs?lat=12.97&lng=77.59

- 200 jobs sorted distance/fee. Errors: `503 DELIVERY_NO_DRIVERS` (empty, retryable).

### POST /delivery/:id/accept (Driver)

- 200 locked. Race loser `409 DELIVERY_ALREADY_ACCEPTED`. Accept window 60s (FR-038) else `410 DELIVERY_ASSIGNMENT_EXPIRED`.

### POST /delivery/:id/location (Driver)

```json
{ "lat": 12.9716, "lng": 77.5946 }
```

- 200 broadcast to `order:<id>` room (Socket.io FR-037). Stale `404 DELIVERY_LOCATION_STALE`.

### POST /delivery/:id/proof (Driver)

- Multipart photo or `{ signature }`. Required before Delivered (FR-039). Errors: `400 DELIVERY_PROOF_REQUIRED`.

---

## 13. Notification Module

| Method | Endpoint | Auth | Description |
| :--- | :--- | :---: | :--- |
| GET | /notifications | Yes | Own notifications (bell) |
| POST | /notifications/read | Yes | Mark read |
| PUT | /users/me/preferences | Yes | Channel toggles (see User) |
| POST | /notifications/devices | Yes | Register FCM token |
| DELETE | /notifications/devices/:token | Yes | Remove device |
| GET | /admin/notifications/logs | Admin | All sends (paginated) |

### GET /notifications

- 200 `{ items[], unreadCount }`. Fan-out Email/SMS/Push by prefs (FR-041), Handlebars templates (FR-042), retry x3 backoff (FR-043).
- Errors: `400 NOTIFICATION_CHANNEL_DISABLED`, `403 NOTIFICATION_UNSUBSCRIBED` (with resubscribe CTA).

### POST /notifications/devices

```json
{ "token": "fcm_xxx", "platform": "android" }
```

- 201. Invalid `400 NOTIFICATION_DEVICE_TOKEN_INVALID`.

---

## 14. Review Module

| Method | Endpoint | Auth | Description |
| :--- | :--- | :---: | :--- |
| POST | /reviews | Yes | Submit (Delivered buyers only) |
| GET | /reviews | No | List by product (?productId=, sort, cursor) |
| POST | /reviews/:id/helpful | Yes | Vote helpful |
| POST | /reviews/:id/reply | Vendor | Vendor reply (nested) |
| POST | /admin/reviews/:id/approve | Admin | Approve flagged |
| POST | /admin/reviews/:id/remove | Admin | Remove toxic |

### POST /reviews

```json
{ "productId": "prod_1", "rating": 5, "content": "Great!", "imageUrls": [] }
```

- Synchronous AI moderation before persist (FR-048). 201 `{ review, status: "Published|Pending" }`. Recalcs avg async (FR-047).
- Errors: `403 REVIEW_NOT_ELIGIBLE` (no Delivered order), `409 REVIEW_ALREADY_SUBMITTED`, `400 REVIEW_RATING_INVALID`, `422 REVIEW_MODERATION_FLAGGED` / `REVIEW_FLAGGED_TOXIC` (hidden).

### GET /reviews?productId=prod_1&sort=helpful&limit=10&cursor=xxx

- 200 + pagination (FR-049). Sort `recent|helpful`.

---

## 15. Analytics Module

| Method | Endpoint | Auth | Description |
| :--- | :--- | :---: | :--- |
| GET | /vendor/analytics/dashboard | Vendor | Sales KPIs (isolated) |
| GET | /admin/analytics/kpis | Admin | Platform GMV/DAU |
| POST | /analytics/track | Yes/No | Ingest event (page/click/purchase) |
| POST | /reports/export | Vendor/Admin | Async CSV (job + link) |
| GET | /reports/:jobId | Vendor/Admin | Export status/download |
| POST | /analytics/nl-query | Vendor/Admin | Natural language to SQL |

### GET /vendor/analytics/dashboard?from=2026-08-01&to=2026-09-01

- 200 `{ totalSales, orderCount, topProducts[], conversionRate }`. Enforces `vendor_id` (403 `ANALYTICS_TENANT_FORBIDDEN`).

### POST /reports/export

```json
{ "type": "sales", "from": "2026-08-01", "to": "2026-09-01" }
```

- 202 `{ jobId }` (FR-054 background + temp link). Poll `GET /reports/:jobId` (`ANALYTICS_REPORT_PENDING` while running, `ANALYTICS_EXPORT_TOO_LARGE` on huge range).

### POST /analytics/nl-query (Vendor/Admin)

```json
{ "question": "Top selling category this month?" }
```

- 200 `{ sql, rows[], chart }`. AI translates to ClickHouse SQL (US-059). Degrades `503 ANALYTICS_SERVICE_DEGRADED` (never blocks checkout).

---

## 16. AI Module

| Method | Endpoint | Auth | Description |
| :--- | :--- | :---: | :--- |
| POST | /ai/chat | Yes | RAG chatbot (stream) |
| POST | /ai/describe | Vendor | Product description |
| POST | /ai/embed | Internal/Admin | Embed text (1536-dim) |
| POST | /ai/moderate | Internal | Toxicity/sentiment score |
| POST | /ai/price-suggest | Vendor | Dynamic pricing |
| POST | /ai/fraud-score | Internal | Order risk 0-100 |
| GET | /ai/recommendations | Yes | Personalized products |

### POST /ai/chat (stream, SSE)

```json
{ "message": "Is this good for skiing?", "cartId": "cart_1", "threadId": "th_1" }
```

- Injects cart + history into prompt (FR-056), RAG via Pinecone, streams GPT-4o tokens. Per-user rate limit (FR-057).
- Errors: `429 AI_RATE_LIMIT`, `503 AI_SERVICE_UNAVAILABLE` (fallback: disable chat), `400 AI_CONTEXT_TOO_LONG`.

### POST /ai/describe (Vendor)

- See Product generate-desc. Same contract.

### POST /ai/price-suggest (Vendor)

```json
{ "productId": "prod_1" }
```

- Nightly signals (competitors, inventory FR-058). 200 `{ suggestedMin, suggestedMax }` or `422 AI_PRICING_NO_SIGNAL`.

### POST /ai/fraud-score (Internal, service token)

```json
{ "orderId": "ord_1" }
```

- 200 `{ score, factors[] }`. High score pauses order + admin alert (`AI_FRAUD_REVIEW_REQUIRED`, FR-060).

---

## 17. Admin Module

| Method | Endpoint | Auth | Description |
| :--- | :--- | :---: | :--- |
| GET | /admin/vendors | Admin | Vendor queue (?status=) |
| POST | /admin/vendors/:id/approve | Admin | Approve (Active) |
| POST | /admin/vendors/:id/reject | Admin | Reject with reason |
| POST | /admin/users/:id/ban | Admin | Ban (revoke sessions) |
| POST | /admin/users/:id/unban | Admin | Unban |
| POST | /admin/users/:id/impersonate | Superadmin | Debug as user (audited) |
| GET | /admin/orders | Admin | All orders + saga |
| POST | /admin/orders/:id/refund | Superadmin | Force refund |
| GET | /admin/flags | Admin | List feature flags |
| PUT | /admin/flags/:key | Admin | Toggle flag (pub/sub) |
| GET | /admin/config | Admin | System config |
| PUT | /admin/config | Admin | Update fees/commission |
| GET | /admin/audit | Admin | Immutable audit log |
| GET | /health/ready | No | Deep probe (DB/Redis/ES) |

### POST /admin/vendors/:id/approve, /reject

```json
{ "reason": "GST mismatch" }
```

- Reason required on reject. Emits `KycApproved`, notifies vendor. Double-approve idempotent (`ADMIN_USER_ALREADY_BANNED` pattern).

### POST /admin/users/:id/impersonate (Superadmin)

- 200 short-lived impersonation JWT + audit entry (FR-064). Else `403 ADMIN_IMPERSONATION_DENIED`.

### PUT /admin/config (Admin)

```json
{ "platformFeePercent": 8, "maintenanceMode": false }
```

- Cached + pub/sub refresh (FR-062). Bad value `400 ADMIN_CONFIG_INVALID`. Audit table append-only (FR-063, `403 ADMIN_AUDIT_IMMUTABLE` on edit attempt).

---

## 18. Webhooks

### Stripe (`POST /webhooks/stripe`, No auth, signature REQUIRED)

- Headers: `Stripe-Signature`. Body: RAW buffer (disable JSON parser on this route).
- Verify with `STRIPE_WEBHOOK_SECRET`. Fail `400 PAYMENT_WEBHOOK_SIGNATURE_INVALID`.
- Handle: `payment_intent.succeeded` (order Paid), `charge.refunded` (order Refunded), `account.updated` (vendor Stripe status).
- MUST be idempotent (upsert/lock, FR-031). Duplicate delivery returns 200 `PAYMENT_ALREADY_PROCESSED`.
- Respond 200 fast (<3s), defer heavy work to BullMQ.

```bash
stripe listen --forward-to localhost:5000/webhooks/stripe
stripe trigger payment_intent.succeeded
```

---

## 19. Rate Limits

| Endpoint Group | Limit | Window |
| :--- | :--- | :--- |
| /auth/* | 10 requests | 1 min |
| /products (GET) | 100 requests | 1 min |
| /orders/* | 30 requests | 1 min |
| /ai/* | 20 requests | 1 min |
| /payments/* | 10 requests | 1 min |

Notes (normative, per PRD/Arch):

- Auth login/reset additionally 5 attempts per 15 min per IP (FR-005) mapped to `429 AUTH_RATE_LIMITED`.
- Tiers by role (NFR 6.4): Unauthenticated 100 req/15min, Customer 1000/15min, Vendor 5000/15min, via Redis token bucket. Table above is per-group burst cap inside those tiers.
- AI per-user LLM quota (`AI_RATE_LIMIT_PER_USER`, default 30/hr) maps to `429 AI_RATE_LIMIT`.
- Exceeding returns `429 RATE_LIMITED` (or specific `AUTH_RATE_LIMITED` / `AI_RATE_LIMIT`) with `Retry-After` header + `retryable: true`.
- Webhooks exempt from rate limits (signature-gated instead).

---

## 20. Error Code Index

Full definitions in [error-codes.md](./error-codes.md). Quick map from HTTP to likely codes:

| HTTP | Common codes on these endpoints |
| :--- | :--- |
| 400 | `VALIDATION_FAILED`, `PRODUCT_INVALID_VARIANT`, `ORDER_CART_EMPTY`, `USER_ADDRESS_INVALID`, `SEARCH_QUERY_TOO_SHORT` |
| 401 | `AUTH_INVALID_CREDENTIALS`, `AUTH_TOKEN_EXPIRED`, `AUTH_TOKEN_INVALID`, `AUTH_REFRESH_INVALID`, `AUTH_SESSION_REVOKED` |
| 402 | `ORDER_PAYMENT_FAILED`, `PAYMENT_CARD_DECLINED`, `PAYMENT_INTENT_FAILED` |
| 403 | `AUTH_EMAIL_NOT_VERIFIED`, `AUTH_ACCOUNT_SUSPENDED`, `AUTH_INSUFFICIENT_ROLE`, `VENDOR_NOT_APPROVED`, `PRODUCT_UNAUTHORIZED`, `REVIEW_NOT_ELIGIBLE` |
| 404 | `PRODUCT_NOT_FOUND`, `ORDER_NOT_FOUND`, `VENDOR_NOT_FOUND`, `USER_NOT_FOUND`, `DELIVERY_NOT_FOUND` |
| 409 | `AUTH_EMAIL_EXISTS`, `PRODUCT_DUPLICATE_SKU`, `ORDER_DUPLICATE_IDEMPOTENCY_KEY`, `REVIEW_ALREADY_SUBMITTED`, `DELIVERY_ALREADY_ACCEPTED` |
| 429 | `RATE_LIMITED`, `AUTH_RATE_LIMITED`, `AI_RATE_LIMIT` |
| 502/503/504 | `AI_SERVICE_UNAVAILABLE`, `SEARCH_INDEX_UNAVAILABLE`, `PAYMENT_GATEWAY_TIMEOUT`, `DELIVERY_NO_DRIVERS` (all `retryable: true`) |

Adding an endpoint? Add its row to the module table + a subsection with request/response/errors + rate-limit note + Screen Map link (ui-flows.md) in the same PR.

---

*Questions? Open an issue labeled `api-docs`. Breaking changes require a new `API_VERSION` + migration note, never a silent contract change.*
