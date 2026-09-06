# Progress Tracker — NexCommerce

> **Last Updated:** 2026-09-05
> **Owner:** Product & Engineering Team
> **Source of truth for:** build status of every module (PRD US-001..US-070, FR-001..FR-065)
> **Related Docs:** [prd.md](./prd.md) · [architecture.md](./architecture.md) · [api.md](./api.md) · [ui-flows.md](./ui-flows.md) · [error-codes.md](./error-codes.md) · [env.md](./env.md) · [git-conventions.md](./git-conventions.md)

## How to update this file

1. Update the module section + Overall Dashboard in the SAME PR that changes the status.
2. Status values only: `Done` | `In Progress` | `Planned` | `Blocked`.
3. Percent rule: 0 = Planned, 1-99 = In Progress (code merged to `develop`), 100 = Done (code + tests + docs + CI green on `develop`).
4. Check a story box `- [x]` only when its acceptance criteria pass on `develop` (not just committed).
5. Move the `Last Updated` date on every edit.

```text
Progress bar scale (ASCII only, always renders):
[----------] 0%    [=====-----] 50%   [==========] 100%
```

---

## Overall Dashboard

| # | Module | Status | Progress | Stories done | Notes |
| :--- | :--- | :---: | :---: | :--- | :--- |
| 0 | Docs & Contracts | Done | [==========] 100% | 7/7 docs | PRD, Arch, API, UI flows, errors, env, git conventions |
| 1 | Auth | Planned | [----------] 0% | 0/6 | US-001..US-006, FR-001..FR-005 |
| 2 | User | Planned | [----------] 0% | 0/5 | US-007..US-011, FR-006..FR-010 |
| 3 | Vendor | Planned | [----------] 0% | 0/6 | US-012..US-017, FR-011..FR-015 |
| 4 | Product | Planned | [----------] 0% | 0/8 | US-018..US-025, FR-016..FR-020 |
| 5 | Search | Planned | [----------] 0% | 0/5 | US-026..US-030, FR-021..FR-025 |
| 6 | Order & Cart | Planned | [----------] 0% | 0/7 | US-031..US-037, FR-026..FR-030 |
| 7 | Payment | Planned | [----------] 0% | 0/5 | US-038..US-042, FR-031..FR-035 |
| 8 | Delivery | Planned | [----------] 0% | 0/5 | US-043..US-047, FR-036..FR-040 |
| 9 | Notification | Planned | [----------] 0% | 0/4 | US-048..US-051, FR-041..FR-045 |
| 10 | Review | Planned | [----------] 0% | 0/4 | US-052..US-055, FR-046..FR-050 |
| 11 | Analytics | Planned | [----------] 0% | 0/4 | US-056..US-059, FR-051..FR-055 |
| 12 | AI | Planned | [----------] 0% | 0/6 | US-060..US-065, FR-056..FR-060 |
| 13 | Admin | Planned | [----------] 0% | 0/5 | US-066..US-070, FR-061..FR-065 |
| — | Frontend scaffold (Next.js) | Done | [==========] 100% | — | Fresh Next.js 16 storefront in nexcommerce/client + Express scaffold, probe green |
| — | Infra & CI | Planned | [----------] 0% | — | ECS, RDS, Redis, ES, Husky/commitlint, Actions per git-conventions |

**Totals:** Stories 0/70 done. FRs 0/65 done. Implementation 0%. Docs 100%.

**M0 decisions (2026-09-05, todos P0-012/025/028):**
- Scaffold: re-scaffold — fresh `git init` in `nexcommerce/` (declared cwd; docs + `.opencode` live here). `project/` scaffold abandoned in working tree (20 deletions, no remote); its 2-commit history preserved in the sibling repo, design tokens recoverable via `git -C ../project show f8445b6`.
- Backend decision: Express-monolith per ADR-001 (`docs/architecture.md`). No Next.js full-stack; Next.js only as storefront client per system diagram.
- Package manager decision: pnpm per `docs/architecture.md` S16 (lockfile: `pnpm-lock.yaml`).

---

## Milestones (from PRD)

| Milestone | Scope | Status | Target |
| :--- | :--- | :---: | :--- |
| M0 Docs & contracts | PRD, Arch, API, UI flows, errors, env, git conventions | Done | 2026-09-05 |
| M1 Re-scaffold | Fresh git init in nexcommerce, Express monolith + storefront scaffold, `dev` green | Done | 2026-09-06 |
| M2 Auth + User | JWT/refresh, OAuth, RBAC, profiles, addresses | Planned | MVP |
| M3 Vendor + Product | KYC state machine, store, catalog, variants, inventory locks, images | Planned | MVP |
| M4 Search | ES + Pinecone hybrid, facets, autocomplete | Planned | MVP |
| M5 Order + Payment | Cart (Redis), saga, idempotency, Stripe Connect, webhooks, refunds | Planned | MVP |
| M6 Delivery + Notification | Dispatch 5km, WS tracking, proof, SendGrid/Twilio/FCM fan-out | Planned | MVP |
| M7 Review + AI core | Ratings, toxicity gate, RAG chatbot, AI descriptions | Planned | MVP |
| M8 Analytics + Admin | ClickHouse, dashboards, exports, flags, audit, fraud queue | Planned | MVP |
| M9 MVP launch | All P0 stories live, 99.9% uptime, seed vendors | Planned | Q3 2026 per PRD |

P0 launch gate (must all be Done): US-001, US-002, US-004, US-005, US-006, US-009, US-012, US-013, US-018, US-019, US-022, US-026, US-028, US-031, US-032, US-033, US-038, US-040, US-043, US-048, US-052, US-060, US-066.

---

## 0. Docs & Contracts — Done (100%)

| Doc | Status | Notes |
| :--- | :---: | :--- |
| prd.md (US-001..070, FR-001..065) | Done | Approved for development |
| architecture.md (13 modules, ADR-001 modular monolith) | Done | — |
| api.md (all modules, envelopes, rate limits) | Done | 2026-09-05 |
| ui-flows.md (1535 lines, Mermaid + ASCII) | Done | All roles + screen inventory |
| error-codes.md (0xxx..13xxx) | Done | Envelope + frontend guide |
| env.md (all vars + Zod + .env.example) | Done | — |
| git-conventions.md (branches, commits, PRs) | Done | — |

- [x] PRD approved
- [x] Architecture ADR-001 accepted
- [x] API contracts written
- [x] UI flows + screen map written
- [x] Error codes registered
- [x] Env reference written
- [x] Git conventions agreed

---

## 1. Auth Module — Planned (0%)

Stories (US-001..US-006) / FR-001..FR-005. APIs: api.md Section 5. UI: ui-flows.md Section 7.

- [ ] US-001 Register Account (email+password, verification email)
- [ ] US-002 Login (JWT 15m + refresh 7d, generic invalid-credentials)
- [ ] US-003 OAuth Login (Google/Facebook, link by verified email)
- [ ] US-004 Forgot Password (secure reset link + update)
- [ ] US-005 Refresh Token (silent refresh, 401 forced logout)
- [ ] US-006 RBAC (role claim, 403 on violation)

| Item | Status | Notes |
| :--- | :---: | :--- |
| Schema (`auth_identities`, `refresh_tokens`, `roles_permissions`) | Planned | Argon2 (migrating from bcrypt) |
| Endpoints (`/auth/*`, 11 routes) | Planned | Rate limit 5/15min/IP |
| Redis sessions + revocation on `UserBanned` | Planned | — |
| Tests (login, refresh, RBAC 403, rate limit) | Planned | — |
| UI (`/register`, `/login`, `/forgot-password`, `/reset-password/:token`, `/verify-email`, `/verify-phone`) | Planned | Scaffold deleted — restore first |

---

## 2. User Module — Planned (0%)

Stories US-007..US-011 / FR-006..FR-010. APIs: api.md Section 6.

- [ ] US-007 View Profile
- [ ] US-008 Update Profile
- [ ] US-009 Manage Addresses (exactly one default, geocoded lat/lng)
- [ ] US-010 User Preferences (email/SMS/push toggles)
- [ ] US-011 Upload Avatar (<2MB jpg/png to S3)

| Item | Status | Notes |
| :--- | :---: | :--- |
| Schema (`users`, `addresses`, `user_preferences`, `wishlists`) | Planned | GeoJSON point per address |
| Endpoints (14 routes incl. export + soft-delete) | Planned | GDPR export async |
| Tests (default-address invariant, avatar size) | Planned | — |
| UI (`/profile`, `/profile/setup`, `/addresses`, `/wishlist`) | Planned | — |

---

## 3. Vendor Module — Planned (0%)

Stories US-012..US-017 / FR-011..FR-015. APIs: api.md Section 7.

- [ ] US-012 Register Vendor (Pending state)
- [ ] US-013 Upload KYC Documents (private S3, presigned 15m)
- [ ] US-014 Store Setup (slug, logo/banner/policies, live preview)
- [ ] US-015 View Commission Rates
- [ ] US-016 Payout History (Stripe Connect transfers, paginated)
- [ ] US-017 Vendor Dashboard (sales, orders, top products)

| Item | Status | Notes |
| :--- | :---: | :--- |
| State machine Pending > In Review > Active/Rejected/Suspended | Planned | Gates product create + payouts |
| Stripe Express onboarding gate (FR-015) | Planned | Banner until complete |
| Tests (state transitions, slug uniqueness) | Planned | — |
| UI (`/vendor/onboarding`, `/vendor/dashboard`, `/vendor/settings`, `/store/:slug`) | Planned | — |

---

## 4. Product Module — Planned (0%)

Stories US-018..US-025 / FR-016..FR-020. APIs: api.md Section 8.

- [ ] US-018 Create Product
- [ ] US-019 Product Variants (unique SKUs per combo)
- [ ] US-020 Manage Product Images (WebP thumb/med/large to S3)
- [ ] US-021 Product Categories (nested hierarchy)
- [ ] US-022 Manage Inventory (immediate count update)
- [ ] US-023 Bulk Import Products (CSV background job + error report)
- [ ] US-024 AI Product Description (OpenAI SEO copy)
- [ ] US-025 View Price History

| Item | Status | Notes |
| :--- | :---: | :--- |
| Schema (`products`, `product_variants`, `categories`, `inventory_transactions`, `product_assets`) | Planned | JSONB attrs, global SKU unique |
| Inventory locking (15m TTL Redis, decrement on payment success) | Planned | Core oversell guard |
| Search sync events (`ProductCreated/Updated` to ES+Pinecone) | Planned | Async, lag noted in UI |
| Tests (SKU race, lock contention 409) | Planned | — |
| UI (`/vendor/products`, `/new`, `/:id/edit`, `/vendor/inventory`, `/import`) | Planned | AI button + live preview |

---

## 5. Search Module — Planned (0%)

Stories US-026..US-030 / FR-021..FR-025. APIs: api.md Section 9.

- [ ] US-026 Keyword Search (Elasticsearch BM25)
- [ ] US-027 Semantic Search (Pinecone vectors, `text-embedding-3-small`)
- [ ] US-028 Search Filters (price/brand/rating, instant refine)
- [ ] US-029 Autocomplete Suggestions (3+ chars, ES)
- [ ] US-030 Search Analytics Tracking (ClickHouse)

| Item | Status | Notes |
| :--- | :---: | :--- |
| Hybrid merge (BM25 + cosine, configurable weights) | Planned | Fallback keyword on Pinecone down |
| Facets + cursor pagination | Planned | p95 <50ms target |
| Index sync (`index_sync_state` table for recovery) | Planned | — |
| Tests (fallback chip, short-query guard) | Planned | — |
| UI (`/search`, `/product/:id` similar rail) | Planned | Shareable query URLs |

---

## 6. Order & Cart Module — Planned (0%)

Stories US-031..US-037 / FR-026..FR-030. APIs: api.md Section 10.

- [ ] US-031 Add to Cart (Redis session, anon merge on login)
- [ ] US-032 Checkout Flow (tax/shipping/total calc)
- [ ] US-033 Order Tracking (Pending > Paid > Processing > Shipped > Delivered)
- [ ] US-034 Cancel Order (Pending only, release + refund)
- [ ] US-035 Return Order (<14d Delivered, vendor approval)
- [ ] US-036 Order History (paginated)
- [ ] US-037 Reorder (available items to cart)

| Item | Status | Notes |
| :--- | :---: | :--- |
| Saga orchestration + `saga_logs` + compensating tx | Planned | Highest-risk module |
| Idempotency keys on checkout | Planned | No double orders |
| Tests (saga compensating, duplicate key, state machine) | Planned | `test(order)` required by git conventions |
| UI (`/cart`, `/checkout`, `/order/:id/confirmation`, `/order/:id/track`, `/orders`) | Planned | Idempotency key client-generated |

---

## 7. Payment Module — Planned (0%)

Stories US-038..US-042 / FR-031..FR-035. APIs: api.md Section 11 + Webhooks.

- [ ] US-038 Checkout Payment processing (Stripe intent to Paid)
- [ ] US-039 Process Refund (Stripe, commission-adjusted)
- [ ] US-040 Vendor Payout via Stripe Connect (holding period, minus commission)
- [ ] US-041 Payment History Dashboard (admin audit)
- [ ] US-042 Failed Payment Retry (new intent, cart kept)

| Item | Status | Notes |
| :--- | :---: | :--- |
| Destination charges split + integer paise storage | Planned | — |
| Webhook verify + upsert/lock (before/after race) | Planned | Return 200 on dup |
| Radar/fraud Manual Review gate | Planned | — |
| Tests (webhook race, refund math, payout min Rs 500) | Planned | Stripe CLI mocked |
| UI (Stripe Elements in checkout, `/vendor/payouts`, `/admin/orders` refund) | Planned | No raw PAN on our servers |

---

## 8. Delivery Module — Planned (0%)

Stories US-043..US-047 / FR-036..FR-040. APIs: api.md Section 12.

- [ ] US-043 Accept Delivery Assignment (lock to account)
- [ ] US-044 Live GPS Tracking (Socket.io per-order room)
- [ ] US-045 Proof of Delivery (photo/signature required)
- [ ] US-046 Reassign Delivery (15m stall rebroadcast)
- [ ] US-047 Delivery History & Earnings

| Item | Status | Notes |
| :--- | :---: | :--- |
| PostGIS 5km match + 60s accept window | Planned | Next-nearest on timeout |
| WS broadcast + throttled uplink (battery) | Planned | Mobile-first |
| Tests (accept race 409, stale GPS) | Planned | — |
| UI (`/delivery/jobs`, `/active/:id`, `/delivery/earnings`, customer track map) | Planned | 48px targets, offline queue |

---

## 9. Notification Module — Planned (0%)

Stories US-048..US-051 / FR-041..FR-045. APIs: api.md Section 13.

- [ ] US-048 Order Status Notifications (BullMQ to SendGrid + FCM on Shipped etc.)
- [ ] US-049 Notification Preferences (channel routing)
- [ ] US-050 Marketing Opt-in/out (one-click unsubscribe)
- [ ] US-051 In-App Notification Center (bell badge + list)

| Item | Status | Notes |
| :--- | :---: | :--- |
| Fan-out topic + Handlebars templates + retry x3 backoff | Planned | — |
| FCM tokens (`user_devices`), SendGrid + Twilio providers | Planned | Circuit breakers |
| Tests (pref routing, retry) | Planned | — |
| UI (bell, `/notifications`, `/preferences`) | Planned | — |

---

## 10. Review Module — Planned (0%)

Stories US-052..US-055 / FR-046..FR-050. APIs: api.md Section 14.

- [ ] US-052 Write Product Review (verified buyer, 1-5 + text)
- [ ] US-053 AI Review Moderation (toxicity >0.8 hidden + manual queue)
- [ ] US-054 Review Helpfulness Voting
- [ ] US-055 Vendor Response to Review (nested `parent_review_id`)

| Item | Status | Notes |
| :--- | :---: | :--- |
| Verified-purchase check + avg recalc cached | Planned | Cursor pages, Recent/Helpful sort |
| Sync AI check before persist | Planned | — |
| Tests (non-buyer 403, dup vote 409) | Planned | — |
| UI (PDP reviews, `/vendor/reviews`, `/admin/reviews/moderation`) | Planned | — |

---

## 11. Analytics Module — Planned (0%)

Stories US-056..US-059 / FR-051..FR-055. APIs: api.md Section 15.

- [ ] US-056 Vendor Sales Dashboard (GMV time-series)
- [ ] US-057 Admin Platform Dashboard (ClickHouse real-time)
- [ ] US-058 Export Reports (CSV background + temp link)
- [ ] US-059 AI Insights Query (NL to SQL on ClickHouse)

| Item | Status | Notes |
| :--- | :---: | :--- |
| Kafka event stream + materialized daily views + 5m Redis cache | Planned | Fail-safe (never blocks checkout) |
| Tenant isolation (`vendor_id`) | Planned | 403 on cross-tenant |
| Tests (isolation, export job) | Planned | — |
| UI (`/vendor/analytics`, `/admin/analytics`) | Planned | — |

---

## 12. AI Module — Planned (0%)

Stories US-060..US-065 / FR-056..FR-060. APIs: api.md Section 16.

- [ ] US-060 RAG Chatbot Conversation (Pinecone context + GPT-4 stream)
- [ ] US-061 Dynamic Pricing Recommendations (nightly cron)
- [ ] US-062 Generate AI Descriptions (vendor button; see US-024)
- [ ] US-063 AI Fraud Detection Alert (risk 0-100, pause + admin alert)
- [ ] US-064 Personalized Recommendations (collaborative embeddings)
- [ ] US-065 Natural Language Analytics (admin chat; see US-059)

| Item | Status | Notes |
| :--- | :---: | :--- |
| Per-user LLM rate limit + graceful fallbacks (AI down path) | Planned | Cost guard |
| Embeddings pipeline (`text-embedding-3-small`) | Planned | Shared with Search |
| Tests (rate limit 429, fallback, fraud hold) | Planned | — |
| UI (chat drawer, Ask-AI boxes, pricing cards) | Planned | First token <500ms target |

---

## 13. Admin Module — Planned (0%)

Stories US-066..US-070 / FR-061..FR-065. APIs: api.md Section 17.

- [ ] US-066 Approve/Reject Vendor
- [ ] US-067 Ban User/Vendor (revoke sessions)
- [ ] US-068 Manage Feature Flags (instant via pub/sub)
- [ ] US-069 System Configuration (fees/commission, no deploy)
- [ ] US-070 Audit Logs (append-only, immutable)

| Item | Status | Notes |
| :--- | :---: | :--- |
| Superadmin overrides + impersonation (audited, no password) | Planned | `ADMIN_IMPERSONATION_DENIED` otherwise |
| Config cached + pub/sub refresh | Planned | DB revoke UPDATE/DELETE on audit |
| Tests (ban revokes, audit immutable 403) | Planned | — |
| UI (`/admin/*`: dashboard, vendors, users, orders+saga, fraud, moderation, analytics, flags, config, audit, health) | Planned | Desktop-first |

---

## Risks & Blockers

| Risk | Impact | Mitigation / Next step |
| :--- | :--- | :--- |
| Frontend scaffold files deleted in working tree (all `src/*`, configs show `D` in git status) | Blocked — no UI can build | Decide: `git restore .` or keep deletion and re-scaffold; then re-apply design-system commit |
| 0% implementation, Q3 2026 MVP date | Schedule | Follow M1..M9 order; P0 gate first; keep PRs <800 lines per git conventions |
| Saga + webhook races (inventory, payment double-charge) | Correctness | Build Order+Payment with idempotency + saga logs + Stripe-CLI tests first |
| AI cost overruns | Budget | Ship per-user quotas + fallbacks (keyword search, disabled chat) from day one |
| Docs untracked (`??` in git status: api.md, prd.md, etc.) | Loss risk | Commit docs per git conventions (`docs(api): ...`) on `develop` via PR |

---

## Recent Activity (from git)

- `f8445b6` Add ecommerce design system: theme tokens + custom Tailwind classes
- `26daa78` Initial commit from Create Next App
- Working tree: scaffold deletions unstaged + 7 untracked docs (this file will be 8th).

Update this section on each PR merge (newest first, max 10 lines).

---

*Template for a module update PR: change its Status/Progress row + checklist + Risks if affected. Never mark Done without tests + CI green + docs (api.md / ui-flows.md) updated.*
