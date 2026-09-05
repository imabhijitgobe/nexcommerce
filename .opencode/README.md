# .opencode — NexCommerce Agent Pack

Adapted from [jsmastery-pro/skills](https://github.com/jsmastery-pro/skills) (MIT) for the NexCommerce AI powered multi vendor e-commerce platform. Workflow mechanics are unchanged; every project specific path, doc, and convention points at this repo's `docs/`.

Layout follows OpenCode auto-discovery: `agents/` holds subagents (frontmatter `mode: subagent`), `skills/<name>/SKILL.md` holds skills (frontmatter `name` + trigger `description`). Supporting files (modes, templates, guides, checklists, `openai.yaml` client adapters, `docs/workflow-guide.md`, `docs/conventions.md`) ride along untouched. Restart opencode after changing anything here; config loads once at startup.

## Agents (`agents/`)

| Agent | Job | NexCommerce notes |
| :--- | :--- | :--- |
| `scout` | Read only code exploration, returns a compact map. Never edits. | Cites `docs/todos.md` task IDs, `docs/error-codes.md` codes, and the owning module plus closest US story. |
| `researcher` | Read only web and registry lookup, returns distilled answers. | Prioritizes Stripe, OpenAI, Pinecone, Elasticsearch, ClickHouse, Redis/BullMQ, Prisma; confirms against `docs/env.md` keys and `docs/api.md` shapes. |

## Skills (`skills/`)

| Skill | Job | NexCommerce wiring |
| :--- | :--- | :--- |
| `scope` | Plan work, reconcile shipped work, enroll features. | Owns `docs/todos.md` + `docs/progress.md` mirror (there is no `docs/scope/`). Done when lines trace to PRD US-001..US-070. |
| `architect` | Deliberate load bearing decisions, write specs to `docs/specs/`. | Links PRD story + todos IDs; stack fixed by ADR-001, decide saga/webhook/locking/idempotency/AI fallback questions. |
| `develop` | Build from spec + conventions, advance todos. | Gate: PRD acceptance criteria + `docs/api.md` contract. Conventions: `docs/git-conventions.md`, `docs/error-codes.md`. UI: `docs/ui-flows.md`. Ticks `docs/todos.md`, mirrors `docs/progress.md`. |
| `check` | `verify` (run the app, prove behavior) or `review` (fresh model read, findings to `docs/reviews/`). | Contract: PRD acceptance criteria + `docs/api.md`; surfaces from `docs/ui-flows.md` and `docs/architecture.md` Section 7. |
| `test` | Write suites for uncommitted changes, trace to acceptance criteria. | Tags `covers: US-xxx` + todos ID; Jest/Vitest + Supertest, Playwright for flows; commits `test(<scope>): …`. |
| `document` | `pr`, `changelog`, `release-note`, `postmortem` prose from the real diff. | PR titles `type(scope): description` per `docs/git-conventions.md`; bodies link US story + todos IDs. |
| `debug` | Reproduce, localize, hypothesize, fix root cause, verify. | Maps symptoms to `docs/error-codes.md` first; hot spots: saga compensation, webhook race, inventory locks, AI fallback. |
| `audit` | Bootstrap/maintain `AGENTS.md` context (none exists yet). | Points at `docs/`, never duplicates it. |
| `sync` | Reconcile durable knowledge after a change. | Ticks `docs/todos.md` from evidence + `docs/progress.md` mirror; flags stale US coverage. |

Supporting files (modes, templates, guides, checklists, `openai.yaml` client adapters, `docs/workflow-guide.md`, `docs/conventions.md`) are copied from upstream; only the project specific paths above were rewired.

## The 13 modules (also the commit scopes)

auth, user, vendor, product, search, order, payment, delivery, notification, review, analytics, ai, admin — plus api, db, infra, ci, deps, docs, config. See `docs/git-conventions.md`.

## Conventions every skill follows (upstream, kept)

- The engineer decides; the AI recommends. Checks are offered, never auto applied; skipped steps recorded honestly as skipped.
- Every user facing question carries exactly one recommended option with a one line why.
- `done` is the engineer's to declare, never gated by a skill.
