# Git Conventions — NexCommerce

> **Version:** 1.0.0
> **Last Updated:** 2026-09-05
> **Status:** Active — All contributors MUST follow
> **Related Docs:** [architecture.md](./architecture.md) · [prd.md](./prd.md)

This document defines the **single source of truth** for branching, committing, pull requests, merging, releasing, and tagging in NexCommerce. Goal: clean history, safe `main`, fast reviews, traceable releases.

---

## Table of Contents

1. [Branch Strategy](#1-branch-strategy)
2. [Branch Naming Conventions](#2-branch-naming-conventions)
3. [Branch Lifecycle & Protection Rules](#3-branch-lifecycle--protection-rules)
4. [Commit Message Format](#4-commit-message-format)
5. [Commit Types](#5-commit-types)
6. [Scopes (NexCommerce Modules)](#6-scopes-nexcommerce-modules)
7. [Commit Rules](#7-commit-rules)
8. [Commit Examples](#8-commit-examples)
9. [Pull Request Rules](#9-pull-request-rules)
10. [Merge Strategy](#10-merge-strategy)
11. [Release, Versioning & Tagging](#11-release-versioning--tagging)
12. [Hotfix Workflow](#12-hotfix-workflow)
13. [Git Hooks & CI Enforcement](#13-git-hooks--ci-enforcement)
14. [Best Practices & Anti-Patterns](#14-best-practices--anti-patterns)
15. [Cheat Sheet](#15-cheat-sheet)

---

## 1. Branch Strategy

We use a **`main` / `develop` + short-lived feature branches** model (GitFlow-lite, adapted for modular monolith + trunk-friendly CI).

```text
main              ← Production only. Never push directly.
  └── develop     ← Integration branch
        ├── feature/auth-module
        ├── feature/product-search
        ├── bugfix/cart-race-condition
        └── hotfix/payment-failure
```

| Branch | Purpose | Source | Merge Target | Lifetime |
| :--- | :--- | :--- | :--- | :--- |
| `main` | Production. Always deployable. Tagged releases only. | `hotfix/*` or `develop` (via release) | — | Permanent |
| `develop` | Integration. Next release candidate. All features merge here first. | `main` | `main` (release) | Permanent |
| `feature/*` | New feature / user story (e.g. US-003, FR-024). | `develop` | `develop` | Delete after merge |
| `bugfix/*` | Non-urgent bug fix on `develop`. | `develop` | `develop` | Delete after merge |
| `hotfix/*` | Critical production fix. | `main` | `main` + `develop` | Delete after merge |
| `release/*` | Stabilization, version bump, changelog (optional, for major releases). | `develop` | `main` + `develop` | Delete after merge |
| `chore/*`, `docs/*`, `test/*`, `refactor/*` | Non-feature work following same lifecycle as `feature/*`. | `develop` | `develop` | Delete after merge |

**Rules:**
1. NEVER commit/push directly to `main` or `develop`. All changes go via PR.
2. ALWAYS branch from the correct base: features/bugfixes from `develop`, hotfixes from `main`.
3. Keep branches **short-lived** (< 3 days ideal, max 7 days). Rebase frequently.
4. One branch = one concern (one US/FR/fix). Do not mix features + refactors.
5. Delete branch after merge (GitHub auto-delete enabled).

---

## 2. Branch Naming Conventions

Format:

```text
<prefix>/<short-kebab-case-description>
```

Optionally suffixed with ticket ID:

```text
<prefix>/<short-kebab-case-description>-<TICKET-ID>
```

| Prefix | Use When | Example |
| :--- | :--- | :--- |
| `feature/` | New feature, user story, FR | `feature/auth-module`, `feature/semantic-search-US-027` |
| `bugfix/` | Bug fix on develop (non-prod) | `bugfix/cart-race-condition`, `bugfix/inventory-lock-FR-018` |
| `hotfix/` | Critical prod fix | `hotfix/payment-failure`, `hotfix/stripe-webhook-race` |
| `release/` | Release stabilization | `release/v1.2.0` |
| `refactor/` | Code restructure, no behavior change | `refactor/product-search-service` |
| `test/` | Test-only changes | `test/order-saga-compensating-tx` |
| `docs/` | Docs-only | `docs/stripe-webhook-guide` |
| `chore/` | Build, CI, deps, config | `chore/upgrade-prisma-5`, `chore/es-index-mapping` |
| `perf/` | Performance improvement | `perf/search-p95-optimization` |

**Naming rules:**
- Lowercase, kebab-case, no spaces/underscores: `feature/product-search` NOT `feature/Product_Search`.
- Short but descriptive (2–5 words): `feature/vendor-kyc-upload` GOOD, `feature/stuff` BAD.
- Include module/scope when possible: `feature/ai-rag-chatbot`, `fix/order-saga-retry`.
- Avoid personal names: `feature/abhi-fix` BAD.

---

## 3. Branch Lifecycle & Protection Rules

### Creating a branch

```bash
git checkout develop
git pull origin develop
git checkout -b feature/product-search
```

### Keeping it fresh

```bash
# Prefer rebase for feature branches to keep linear history
git fetch origin
git rebase origin/develop
# If conflicts: resolve, then git rebase --continue
```

### Protection (enforced via GitHub Settings)

| Rule | `main` | `develop` |
| :--- | :---: | :---: |
| Direct push blocked | ✅ | ✅ |
| Require PR + 1 approval | ✅ (2 for payment/auth) | ✅ (1) |
| All CI checks must pass | ✅ | ✅ |
| Require branches up-to-date | ✅ | ✅ |
| Require linear history / squash | ✅ squash | ✅ squash |
| Dismiss stale approvals on push | ✅ | ✅ |
| CODEOWNERS review required | ✅ | ✅ |

> Sensitive modules (`auth`, `payment`, `order`, `admin`) require **2 reviewers**, one being a CODEOWNER.

---

## 4. Commit Message Format

We follow **Conventional Commits**. Every commit MUST match:

```text
type(scope): short description in imperative mood

[optional body — what and why, not how]

[optional footer — Breaking Changes, refs, co-authors]
```

Formal regex enforced by commitlint:

```text
^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\([a-z0-9-]+\))?(!)?: .{1,72}$
```

Anatomy:

1. **type** — required. See [Commit Types](#5-commit-types).
2. **scope** — required for `feat`/`fix`/`refactor`/`test`, optional otherwise. Module name in lowercase. See [Scopes](#6-scopes-nexcommerce-modules).
3. **description** — required. Imperative, lowercase start, no trailing period, ≤72 chars.
4. **body** — optional. Explain *what + why*. Wrap at 72 chars. Required if change is non-obvious (race conditions, saga, webhook ordering).
5. **footer** — optional. `Refs: US-031, FR-018`, `Closes #123`, `BREAKING CHANGE: ...`.

Full example:

```text
fix(cart): resolve race condition on inventory lock

Use Redis Redlock with 15min TTL (FR-018) instead of in-memory
mutex which failed under multi-pod ECS. Prevents oversell when
two checkouts hit same SKU concurrently.

Refs: US-031, FR-018
Closes #214
```

Breaking change example:

```text
feat(auth)!: switch password hashing from bcrypt to argon2

BREAKING CHANGE: existing password hashes invalid, requires
forced reset migration. See docs/auth-migration.md.
```

---

## 5. Commit Types

| Type | Meaning | Semver | Example |
| :--- | :--- | :--- | :--- |
| `feat` | New feature | minor | `feat(auth): add Google OAuth login` |
| `fix` | Bug fix | patch | `fix(cart): resolve race condition on inventory lock` |
| `docs` | Documentation only | — | `docs(api): add Stripe webhook documentation` |
| `style` | Formatting only (no logic) | — | `style(product): run prettier on search service` |
| `refactor` | Code restructure, no behavior change | — | `refactor(product): extract search logic to separate service` |
| `perf` | Performance improvement | patch | `perf(search): add ES cursor pagination for p95 <50ms` |
| `test` | Adding / updating tests | — | `test(order): add saga compensating transaction tests` |
| `chore` | Build, deps, config, CI | — | `chore(deps): bump prisma to 5.18.0` |
| `build` | Build system / Docker / bundler | — | `build(docker): multi-stage ECS fargate image` |
| `ci` | CI workflows only | — | `ci(pipeline): add pinecone index check to PR` |
| `revert` | Revert prior commit | — | `revert(payment): revert split-charge logic` |

> Use `feat`/`fix` for user-facing changes. Use `refactor` ONLY if behavior is identical (must be covered by tests). If in doubt, use `feat` or `fix`.

---

## 6. Scopes (NexCommerce Modules)

Scope MUST be one of these (lowercase, singular). Maps 1:1 to `architecture.md` modules + cross-cutting concerns:

| Scope | Module | Examples |
| :--- | :--- | :--- |
| `auth` | Auth (JWT, OAuth, RBAC) | login, refresh, OAuth |
| `user` | User, addresses, wishlist | profile, geocoding |
| `vendor` | Vendor, KYC, store | onboarding, commission |
| `product` | Product, variants, inventory | catalog, SKU, S3 assets |
| `search` | Search (ES + Pinecone) | hybrid search, facets |
| `order` | Order, cart, saga | checkout, idempotency |
| `payment` | Payment (Stripe Connect) | intents, webhooks, refunds |
| `delivery` | Delivery, drivers, WS | dispatch, GPS tracking |
| `notification` | Notification (SendGrid/Twilio/FCM) | templates, fan-out |
| `review` | Review + moderation | ratings, toxicity |
| `analytics` | Analytics (ClickHouse) | dashboards, exports |
| `ai` | AI (RAG, embeddings, pricing, fraud) | chatbot, recommendations |
| `admin` | Admin, flags, audit | impersonation, config |
| `api` | API gateway, middleware, versioning | rate-limit, validation |
| `db` | Prisma, migrations, Redis, ES mappings | schema, indexes |
| `infra` | Docker, Terraform, AWS, Nginx | ECS, ALB, VPC |
| `ci` | GitHub Actions, Husky, lint | workflows |
| `deps` | Dependencies | bumps |
| `docs` | Repo docs | PRD, architecture |
| `config` | Env, feature flags | `.env`, constants |

If change spans multiple modules, use the **primary** module or `api`. Do NOT use `feat VARIOUS ...` or multiple scopes like `feat(auth,order): ...`.

---

## 7. Commit Rules

1. **Atomic commits** — one logical change per commit. `git add -p` encouraged.
2. **Imperative mood** — `add` not `added`/`adds`: `feat(auth): add Google OAuth` GOOD, `feat(auth): added ...` BAD.
3. **Lowercase description start** (after colon+space), no trailing period.
4. **≤72 chars** for subject line. Body wrapped at 72.
5. **Explain why in body** for `fix`/`refactor`/`perf` touching sagas, inventory, payments, webhooks, AI fallbacks.
6. **Reference tickets**: add `Refs: US-XXX, FR-XXX` and/or `Closes #<issue>` in footer when applicable.
7. **No junk commits**: no `wip`, `fix typo again`, `tmp`. Squash locally before pushing: `git rebase -i origin/develop`.
8. **No secrets**: never commit `.env`, `*.pem`, KYC docs, Stripe keys. Use AWS Secrets Manager + `.env.example`.
9. **No generated files**: never commit `node_modules/`, `dist/`, `.next/`, coverage. Respect `.gitignore`.
10. **Verify before commit**: `npm run lint && npm run typecheck && npm run test:changed` must pass.

Bad vs Good:

```text
BAD:  fixed bug
BAD:  WIP auth stuff
BAD:  feat(Auth): Added Google OAuth Login.
GOOD: feat(auth): add Google OAuth login
GOOD: fix(payment): handle stripe webhook arriving before api response
```

---

## 8. Commit Examples

Canonical examples (from project prompt — MUST be copied verbatim in style):

```text
feat(auth): add Google OAuth login
fix(cart): resolve race condition on inventory lock
docs(api): add Stripe webhook documentation
test(order): add saga compensating transaction tests
refactor(product): extract search logic to separate service
```

Extended per-module examples:

```text
feat(search): add hybrid BM25 + vector search with configurable weights
feat(product): add AI product description generation via GPT-4o
feat(order): enforce idempotency keys on checkout endpoint
feat(payment): add Stripe Connect destination charges with commission split
feat(delivery): add websocket live GPS tracking for driver location
feat(review): add AI toxicity check before persisting review
feat(ai): add RAG chatbot with cart context injection
feat(admin): add impersonation endpoint for debugging vendors
fix(auth): invalidate refresh tokens on UserBanned event
fix(product): prevent duplicate SKU on concurrent variant creation
fix(search): fallback to Elasticsearch when Pinecone is unavailable
fix(order): release inventory on PaymentFailed saga compensation
fix(payment): use upsert locking for out-of-order stripe webhooks
perf(search): cache admin dashboard aggregates in Redis with 5min TTL
test(payment): add refund commission adjustment tests
test(auth): add RBAC forbidden-access tests for admin routes
docs(prd): clarify vendor state machine Pending -> Active
chore(deps): bump openai sdk to latest for text-embedding-3-small
ci(pipeline): fail PR if Elasticsearch index mapping drifts
```

---

## 9. Pull Request Rules

### 9.1 PR Title
- MUST follow commit format: `type(scope): short description`.
- Squash-merge uses PR title as final commit message — keep it clean.
- Good: `feat(search): add semantic search with Pinecone`
- Bad: `Search stuff`, `[WIP] search`, `feat: stuff + fix bug`.

### 9.2 PR Description (required template)

```markdown
## What
<!-- 1-3 sentences: what changed -->

## Why
<!-- Link US/FR/PRD section: e.g. US-027, FR-023. Why is this needed? -->

## How
<!-- Key approach, tradeoffs, saga/event changes -->

## Testing
<!-- Commands run + results: npm run test, manual steps, screenshots -->
- [ ] `npm run lint && npm run typecheck` passes
- [ ] Unit tests added/updated
- [ ] Manual verification: ...

## Risks / Rollback
<!-- Migrations, breaking changes, feature flag, rollback plan -->

Closes #<issue-number>
Refs: US-XXX, FR-XXX
```

Empty / `no description` PRs are auto-rejected.

### 9.3 PR Checklist (author self-review BEFORE requesting review)

- [ ] Title follows `type(scope): description`.
- [ ] Description filled (What/Why/How/Testing).
- [ ] All CI checks green (lint, typecheck, tests, build, Snyk, index-sync check).
- [ ] Self-reviewed diff (no `console.log`, no commented code, no secrets).
- [ ] Tests added for `feat`/`fix` (or justification why not).
- [ ] No scope creep — PR < 400 lines diff ideal, max ~800. Split if larger.
- [ ] Prisma migration reviewed + reversible (if `db` change).
- [ ] Docs updated (`docs/`, OpenAPI/Zod schemas, `.env.example`) if API/config changed.
- [ ] Linked issue/ticket (`Closes #...`, `Refs: US-...`).
- [ ] Branch up-to-date with base (`git rebase origin/develop`).

### 9.4 Review & Approval

- Minimum **1 approval** for `develop`, **2 approvals** for `main` / `auth` / `payment` / `order`.
- Resolve all conversations before merge. No `LGTM`-only merges on sensitive modules.
- Reviewer must check: correctness, saga compensation, RBAC, idempotency, N+1 queries, PII handling, error mapping (401/403/402/409).
- Use GitHub suggestions + `Request changes` for blocking issues.

---

## 10. Merge Strategy

| Target | Strategy | Why |
| :--- | :--- | :--- |
| `feature/*` → `develop` | **Squash and merge** | One PR = one clean commit on develop |
| `bugfix/*` → `develop` | **Squash and merge** | Same as above |
| `develop` → `main` (release) | **Merge commit** (`--no-ff`) | Preserve release boundary + changelog |
| `hotfix/*` → `main` + `develop` | **Squash to main**, then forward-merge/backport to develop | Fix prod fast, keep develop in sync |

Rules:
- Never `git push --force` to `main`/`develop`. Force-push only on own feature branch after rebase.
- After squash, final message = PR title + PR body summary + `Closes #...`.
- Enable auto-delete branches after merge.
- If conflicts on release merge, resolve on `release/*` branch, never directly on `main`.

```bash
# Update feature branch before merge
git fetch origin
git rebase origin/develop
git push --force-with-lease
```

---

## 11. Release, Versioning & Tagging

We use **SemVer** (`MAJOR.MINOR.PATCH`, e.g. `v1.4.2`):

- `MAJOR` — breaking API change (`feat!`, auth hash migration, order state machine change).
- `MINOR` — backward-compatible feature (`feat`).
- `PATCH` — bug/perf fix (`fix`, `perf`).

Flow:

```bash
# 1. From develop, cut release branch
git checkout develop && git pull
git checkout -b release/v1.2.0

# 2. Bump version + changelog (npm version updates package.json + tag)
npm version minor -m "release: v%s"
# Update CHANGELOG.md (generated via conventional-changelog)

# 3. PR release/v1.2.0 -> main, get 2 approvals, merge (--no-ff)
# 4. Tag + GitHub Release
git checkout main && git pull
git tag -a v1.2.0 -m "release: v1.2.0 — semantic search + RAG chatbot"
git push origin v1.2.0
# 5. Back-merge main -> develop
git checkout develop && git merge main && git push
```

Tag format: `vX.Y.Z` (annotated tags only). Never move tags. Pre-releases: `v1.2.0-rc.1`.

---

## 12. Hotfix Workflow

For critical prod incidents (payment failure, auth outage, oversell):

```bash
git checkout main && git pull
git checkout -b hotfix/payment-failure
# ... fix + test ...
git push -u origin hotfix/payment-failure
# PR -> main (label: hotfix, 2 approvals, expedited CI)
# After merge to main + tag v1.2.1, backport:
git checkout develop && git pull
git merge main
git push
```

Rules:
- Hotfix scope MUST be minimal (no features/refactors).
- MUST include regression test.
- MUST bump PATCH version + tag immediately.
- Post-mortem issue linked in PR (`Refs: INC-XXX`).

---

## 13. Git Hooks & CI Enforcement

Enforced via **Husky + commitlint + lint-staged** (see `chore/` setup):

| Hook | Command | Purpose |
| :--- | :--- | :--- |
| `commit-msg` | `npx commitlint --edit $1` | Reject non-conventional messages |
| `pre-commit` | `npx lint-staged` (eslint + prettier + prisma format) | Block unformatted/broken code |
| `pre-push` | `npm run typecheck && npm run test:changed` | Block type errors / failing tests |

CI (GitHub Actions, required on every PR):
- `lint` — ESLint + Prettier check
- `typecheck` — `tsc --noEmit`
- `test` — Jest/Vitest unit + integration (order saga, payment webhooks mocked via Stripe CLI)
- `build` — `npm run build` + Docker build smoke
- `snyk` — dependency vuln scan
- `migrate-check` — Prisma validate + ES mapping drift check

Sample `commitlint.config.js`:

```js
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', ['feat','fix','docs','style','refactor','perf','test','build','ci','chore','revert']],
    'scope-empty': [1, 'never'], // warn if feat/fix lacks scope
    'subject-case': [2, 'never', ['sentence-case','pascal-case','upper-case']],
    'header-max-length': [2, 'always', 72],
  },
};
```

---

## 14. Best Practices & Anti-Patterns

**Do:**
- Pull/rebase daily: `git fetch origin && git rebase origin/develop`.
- Commit early, push often on feature branches.
- Use `git add -p` for atomic commits.
- Write meaningful bodies for saga/payment/inventory changes.
- Link every PR to US/FR (traceability to PRD).
- Keep `develop` green — fix broken builds immediately (revert first, investigate after).

**Don't:**
- ❌ `git push origin main --force` — never rewrite public history.
- ❌ Commit `.env`, `*.pem`, `dist/`, `node_modules/`.
- ❌ `fix: stuff`, `wip`, `final v2 real` messages.
- ❌ 2000-line mega-PRs mixing feat + refactor + style.
- ❌ Merge red CI (`admin bypass` only for infra outage with post-approval).
- ❌ Cross-module direct DB queries (violates ADR-001) — go via module API, even in fixes.

Revert policy: if `develop`/`main` breaks, **revert first** (`git revert <sha>` + `revert(scope): ...` commit), then fix forward on a new branch.

---

## 15. Cheat Sheet

```bash
# Start feature
git checkout develop && git pull && git checkout -b feature/<name>

# Daily sync
git fetch origin && git rebase origin/develop

# Atomic commit
git add -p
git commit -m "feat(search): add autocomplete suggestions"
git commit -m "fix(order): release inventory on saga abort" -m "Refs: US-034, FR-027"

# Push + PR
git push -u origin feature/<name>
gh pr create --base develop --title "feat(search): add autocomplete suggestions" --body "Closes #123"

# Amend last commit (only unpushed / own branch)
git commit --amend --no-edit && git push --force-with-lease

# Squash last 3 commits before PR
git rebase -i HEAD~3

# Hotfix
git checkout main && git pull && git checkout -b hotfix/<name>

# Tag release
git tag -a v1.2.0 -m "release: v1.2.0" && git push origin v1.2.0

# Undo / revert
git revert <sha>   # safe revert for shared history
```

---

*Questions? Open an issue with label `git-conventions`. Changes to this file require PR approval from 2 maintainers.*
