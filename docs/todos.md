# NexCommerce - Spec-Driven TODOs

> **Version:** 1.0.0
> **Date:** 2026-09-05
> **Related docs:** docs/prd.md (US-001..US-070, FR-001..FR-065), docs/architecture.md (ADR-001, S7, S16), docs/api.md, docs/ui-flows.md, docs/error-codes.md, docs/env.md, docs/git-conventions.md, docs/progress.md (M0-M9)

## Table of Contents

- [How to Use This File](#how-to-use-this-file)
- [Phase 0 - Repo Hygiene and Baseline Decisions](#phase-0---repo-hygiene-and-baseline-decisions)
- [Phase 1 - Prerequisites and Conventions](#phase-1---prerequisites-and-conventions)
- [Phase 2 - Scaffold Restore or Create](#phase-2---scaffold-restore-or-create-backend--storefront)
- [Phase 3 - Local Infra via Docker Compose](#phase-3---local-infra-via-docker-compose)
- [Phase 4 - Environment Configuration](#phase-4---environment-configuration-per-docsenvmd)
- [Phase 5 - Backend Foundation](#phase-5---backend-foundation-deps-config-middleware-ci-hooks)
- [Wave 1 - Auth](#wave-1---auth-us-001-to-us-006)
- [Wave 2 - User](#wave-2---user-us-007-to-us-011)
- [Wave 3 - Vendor](#wave-3---vendor-us-012-to-us-017)
- [Wave 4 - Product Catalog](#wave-4---product-catalog-us-018us-025)
- [Wave 5 - Search and Discovery](#wave-5---search-and-discovery-us-026us-030)
- [Wave 6 - Order Cart and Payment](#wave-6---order-cart-and-payment-us-031us-042)
- [Wave 7 - Delivery](#wave-7---delivery-us-043us-047)
- [Wave 8 - Notification](#wave-8---notification-us-048us-051)
- [Wave 9 - Review](#wave-9---review-us-052us-055)
- [Wave 10 - Analytics](#wave-10---analytics-us-056us-059)
- [Wave 11 - AI](#wave-11---ai-us-060us-065)
- [Wave 12 - Admin](#wave-12---admin-us-066us-070)
- [MVP Launch Gate](#mvp-launch-gate---p0-verification)
- [Appendix A - Task Index](#appendix-a---task-index)
- [Appendix B - PR Grouping Guide](#appendix-b---pr-grouping-guide)

## How to Use This File

This file is the single execution checklist for NexCommerce. Work top-to-bottom. Do not skip phases.

Rules:

1. Work in order. Complete Phase 0 before Phase 1. Complete all tasks in a section before moving on.
2. Check a box only when its Verify passes. Copy the command, run it locally, compare actual output to expected output.
3. One topic per PR as defined in (docs/git-conventions.md). Use short-lived feature branches off develop.
4. Update progress in the same PR. Mark milestones per (docs/progress.md M0-M9). Every PR that closes tasks must also update docs/progress.md.
5. Reference the spec in reviews. Link US/FR numbers from (docs/prd.md US-001..US-070, FR-001..FR-065) and ADRs from (docs/architecture.md ADR-001).
6. If a Verify fails, stop. Fix, re-run Verify, then continue. Do not check the box on partial success.
7. Keep PRs small. Prefer 1-5 tasks per PR unless tasks are explicitly grouped.

Example workflow for one task:

```
git checkout develop
git pull origin develop
git checkout -b chore/P0-001-inspect-status
# do the single action described in the task
git status --porcelain
# confirm Verify output matches, then commit and push
git add -A
git commit -m "chore: inspect working tree for baseline"
git push -u origin chore/P0-001-inspect-status
# open PR to develop, update docs/progress.md in same PR
```

Branch naming and commit format follow (docs/git-conventions.md). Environment keys follow (docs/env.md). API and error shapes follow (docs/api.md) and (docs/error-codes.md).

Phase overview:

| Phase | Goal | Exit criteria |
| --- | --- | --- |
| Phase 0 | Clean baseline, decisions recorded | develop exists, docs committed via PR, stack decided |
| Phase 1 | Every dev machine ready | node 18+, docker, git config, editor verified |
| Phase 2 | Runnable scaffold | dev server boots, live probe green |
| Phase 3 | Local infra healthy | all 4 services Up, connection strings verified |
| Phase 4 | Env configured | .env.example complete, Zod boot check passes |
| Phase 5 | Foundation green | lint + typecheck + test + build + CI pass |
| Waves 1-12 | Modules built | endpoints + tests + UI per wave, progress updated |
| MVP Gate | Launch ready | all P0 smoke pass, uptime met, seed done |

Conventions used in this file:

- Each task is one single action on one line starting with `- [ ] <ID>`.
- Each task has an indented `Verify:` line with an exact command and expected output.
- References like (docs/architecture.md S16) point to the source of truth. Read them before acting.

Report progress per milestone:

- M0 is repo hygiene and baseline (Phase 0).
- M1 is prerequisites and setup (Phases 1-5, plus setup in docs/architecture.md S16).
- M2-M9 are the module waves per docs/progress.md.

## Phase 0 - Repo Hygiene and Baseline Decisions

Goal: establish a clean, reviewable baseline. Decide what to do about any deleted scaffold, create develop, protect it, commit docs via PR, and lock stack decisions. Related: (docs/progress.md M0), (docs/git-conventions.md), (docs/architecture.md ADR-001, S16).

### 0.1 Inspect current repo state

- [x] P0-001 Run git status to inspect working tree for unexpected changes
  Verify: Run `git status --porcelain` -> expect empty output or a short known list with no untracked secrets
- [x] P0-002 Show recent commits to understand current history
  Verify: Run `git log --oneline -10` -> expect 1-10 lines of history with hashes and messages, no errors
- [x] P0-003 List all local branches to confirm baseline branching state
  Verify: Run `git branch --list` -> expect at least `main` or `master` listed with `*` on current branch
- [ ] P0-004 List remote branches to confirm what exists on origin
  Verify: Run `git branch -r` -> expect `origin/main` or `origin/master` listed, no fetch errors
- [x] P0-005 List docs directory to confirm all spec files are present
  Verify: Run `ls docs` -> expect `prd.md architecture.md api.md ui-flows.md error-codes.md env.md git-conventions.md progress.md`
- [x] P0-006 Read progress milestones M0-M9 to confirm current milestone state
  Verify: Run `grep -n "M0\|M1\|M9" docs/progress.md | head -20` -> expect lines mentioning M0, M1, and M9
- [x] P0-007 Read setup section to confirm expected scaffold layout
  Verify: Run `grep -n "S16\|setup\|prereq" docs/architecture.md | head -20` -> expect at least one match for S16 or setup
- [x] P0-008 Read git conventions for branch and PR rules before making changes
  Verify: Run `grep -n "develop\|main\|PR\|commit" docs/git-conventions.md | head -20` -> expect branch and commit rules listed

### 0.2 Scaffold deletion decision

- [x] P0-009 Check for deleted scaffold files versus HEAD to scope the decision
  Verify: Run `git status --porcelain | head -40` -> expect visible D entries if scaffold was deleted, else empty
- [x] P0-010 Show staged and unstaged diff stat to quantify deletions
  Verify: Run `git diff --stat HEAD | tail -20` -> expect file list with insertions and deletions summary, no errors
- [x] P0-011 List top-level directory to confirm what scaffold remains on disk
  Verify: Run `ls -la | head -40` -> expect entries for `.git`, `docs`, and any remaining app files
- [x] P0-012 Create decision note choosing restore deleted scaffold vs re-scaffold from scratch
  Verify: Run `ls /tmp/opencode/nex-decision.txt && cat /tmp/opencode/nex-decision.txt` -> expect one line containing either `restore` or `re-scaffold`
- [x] P0-013 Record scaffold decision and rationale in docs/progress.md M0 section
  Verify: Run `grep -n "restore\|re-scaffold" docs/progress.md | head -10` -> expect at least one match for the chosen option

### 0.3 Branching and protection setup

- [x] P0-014 Create develop branch from main if it does not exist yet
  Verify: Run `git branch --list develop` -> expect output line `  develop` or `* develop`
- [ ] P0-015 Push develop to origin to establish the integration branch
  Verify: Run `git ls-remote --heads origin develop` -> expect one line with hash and `refs/heads/develop`
- [x] P0-016 Set develop as the working branch for this chunk
  Verify: Run `git rev-parse --abbrev-ref HEAD` -> expect `develop`
- [ ] P0-017 Verify main branch protection requires PR reviews before merge
  Verify: Run `gh api repos/{owner}/{repo}/branches/main/protection --jq .required_pull_request_reviews.required_approving_review_count` -> expect `1` or greater
- [ ] P0-018 Verify develop branch protection requires PR reviews before merge
  Verify: Run `gh api repos/{owner}/{repo}/branches/develop/protection --jq .required_pull_request_reviews.required_approving_review_count` -> expect `1` or greater

### 0.4 Commit docs baseline

- [x] P0-019 Stage docs directory on develop for the baseline PR
  Verify: Run `git status --porcelain docs | head -20` -> expect M or A entries for docs files, no secrets listed
- [x] P0-020 Commit docs baseline with a conventional message per git conventions
  Verify: Run `git log --oneline -1` -> expect message starting with `docs:` and mentioning baseline
- [ ] P0-021 Push docs baseline branch to origin for review
  Verify: Run `git ls-remote --heads origin chore/P0-docs-baseline` -> expect one line with hash and branch ref, or use your actual branch name
- [ ] P0-022 Open PR from docs baseline branch to develop
  Verify: Run `gh pr view --json number,title,baseRefName --jq .baseRefName` -> expect `develop`
- [ ] P0-023 Merge docs baseline PR only after CI and review pass
  Verify: Run `git log origin/develop --oneline -3` -> expect the `docs:` baseline commit in the last 3 commits

### 0.5 Stack and tooling decisions

- [x] P0-024 Compare Express-monolith vs Next.js options against modular monolith ADR
  Verify: Run `grep -n "ADR-001\|modular monolith\|Express\|Next.js" docs/architecture.md | head -20` -> expect ADR-001 and monolith rationale lines
- [x] P0-025 Record explicit backend stack decision as Express-monolith or Next.js in progress M0
  Verify: Run `grep -n "Backend decision:\|Express-monolith\|Next.js" docs/progress.md | head -10` -> expect one explicit decision line
- [x] P0-026 Record Prisma schema source of truth reference for the chosen stack
  Verify: Run `grep -n "S7\|Prisma\|schema" docs/architecture.md | head -10` -> expect Section 7 Prisma schema references
- [x] P0-027 Compare pnpm vs npm for package manager using install speed and lockfile review
  Verify: Run `grep -n "pnpm\|npm" docs/architecture.md docs/env.md | head -20` -> expect at least one match guiding the choice
- [x] P0-028 Record explicit package manager decision as pnpm or npm in progress M0
  Verify: Run `grep -n "Package manager decision:\|pnpm\|npm" docs/progress.md | head -10` -> expect one explicit decision line

## Phase 1 - Prerequisites and Conventions

Goal: make every machine able to build, test, and review. Install runtimes, configure git, set up editor, and verify versions. Related: (docs/progress.md M1), (docs/architecture.md S16), (docs/env.md), (docs/git-conventions.md).

### 1.1 Runtime and package manager

- [x] P1-001 Check installed Node version against required 18+
  Verify: Run `node --version` -> expect `v18.` or `v20.` or `v22.` prefix, no `command not found`
- [x] P1-002 Install or upgrade to Node 18 LTS if version check failed
  Verify: Run `node --version` -> expect `v18.` or higher, no download errors
- [x] P1-003 Verify npm version bundled with Node
  Verify: Run `npm --version` -> expect semantic version like `9.` or `10.` with no errors
- [x] P1-004 Install pnpm globally if pnpm was chosen in P0-028
  Verify: Run `pnpm --version` -> expect semantic version like `8.` or `9.` with no errors
- [ ] P1-005 Verify chosen package manager lockfile strategy matches docs
  Verify: Run `ls package-lock.json pnpm-lock.yaml 2>&1 | head -5` -> expect exactly one lockfile matching P0-028 decision
- [ ] P1-006 Install project dependencies with the chosen package manager
  Verify: Run `ls node_modules/.package-lock.json node_modules/.pnpm-state.json 2>&1 | head -5` -> expect one marker file exists
- [x] P1-007 Verify TypeScript compiler is available for type checks
  Verify: Run `npx tsc --version` -> expect `Version 5.` or higher
- [x] P1-008 Verify Prisma CLI is available for schema work in Section 7
  Verify: Run `npx prisma --version` -> expect output containing `prisma` and a version number

### 1.2 Containers and Git config

- [x] P1-009 Check Docker engine is installed for local Postgres and services
  Verify: Run `docker --version` -> expect `Docker version 24.` or `25.` or higher
- [ ] P1-010 Verify Docker daemon is running and responsive
  Verify: Run `docker info --format '{{.ServerVersion}}'` -> expect a version string like `24.` or `25.` with no daemon errors
- [ ] P1-011 Check Docker Compose v2 is available for multi-service setup
  Verify: Run `docker compose version` -> expect `Docker Compose version v2.` or higher
- [x] P1-012 Set global git user name for attributable commits
  Verify: Run `git config --global user.name` -> expect your full name, non-empty
- [x] P1-013 Set global git user email for attributable commits
  Verify: Run `git config --global user.email` -> expect a valid email containing `@`
- [x] P1-014 Set git default branch to main for new repos per conventions
  Verify: Run `git config --global init.defaultBranch` -> expect `main`
- [x] P1-015 Set git pull to rebase to keep history linear per conventions
  Verify: Run `git config --global pull.rebase` -> expect `true`
- [x] P1-016 Copy env template to local env file without committing secrets
  Verify: Run `ls -l .env 2>&1 | head -5` -> expect `.env` exists with `-rw-------` or `-rw-r--r--` permissions, see (docs/env.md)

### 1.3 Editor and verification

- [x] P1-017 Install ESLint extension for consistent lint feedback in editor
  Verify: Run `code --list-extensions | grep -i eslint` -> expect `dbaeumer.vscode-eslint` listed
- [x] P1-018 Install Prettier extension for consistent formatting in editor
  Verify: Run `code --list-extensions | grep -i prettier` -> expect `esbenp.prettier-vscode` listed
- [x] P1-019 Install Prisma extension for schema highlighting in Section 7 work
  Verify: Run `code --list-extensions | grep -i prisma` -> expect `prisma.prisma` listed
- [x] P1-020 Install Docker extension for container management
  Verify: Run `code --list-extensions | grep -i docker` -> expect `ms-azuretools.vscode-docker` listed
- [ ] P1-021 Run one-shot version summary to confirm all prerequisites pass
  Verify: Run `node --version && npm --version && docker --version && git --version` -> expect four version lines with no `not found` errors
- [ ] P1-022 Verify git remotes point to the correct NexCommerce origin
  Verify: Run `git remote -v | head -5` -> expect `origin` fetch and push URLs for the NexCommerce repo
- [ ] P1-023 Verify develop is up to date with origin before starting next chunk
  Verify: Run `git status -sb | head -2` -> expect `## develop...origin/develop` with no `ahead` or `behind` count
- [ ] P1-024 Update progress milestones M0 and M1 as done in the same PR
  Verify: Run `grep -n "M0.*done\|M1.*done\|M0.*complete\|M1.*complete" docs/progress.md | head -10` -> expect M0 and M1 marked done or complete

## Phase 2 - Scaffold Restore or Create (Backend + Storefront)

Goal: restore-or-rescaffold a clean Express+Prisma modular monolith backend per (docs/architecture.md S8/S16) plus a Next.js storefront client per system diagram, with runnable `dev`/`build`/`test`/`lint`/`typecheck` scripts. Do NOT build module internals here. Phase 5 owns the 13 module skeletons.

Prerequisites: Node 18+, pnpm preferred, git repo with `docs/` present. All paths are repo-relative unless noted.

Expected end state:

| Path | What exists | Source |
| :--- | :--- | :--- |
| `package.json` | scripts dev/build/test/lint/typecheck | (docs/architecture.md S16) |
| `src/app.ts` | Express app export, no listen | (docs/architecture.md S8) |
| `src/server.ts` | HTTP listen + Socket.io stub | (docs/architecture.md S8) |
| `src/config/env.ts` | Zod fail-fast validation | (docs/env.md S12) |
| `prisma/schema.prisma` | stub datasource + generator | (docs/architecture.md S8) |
| `client/` | Next.js storefront scaffold | system diagram Customer Web |

### 2.1 Restore-or-rescaffold decision

Decide first. Do not scaffold blindly over restorable history.

- [ ] P2-001 Check git history for prior scaffold commits
  Verify: Run `git log --oneline -10` -> shows HEAD history or `fatal: no commits` if empty repo
- [ ] P2-002 Check working tree status for existing scaffold files
  Verify: Run `git status --short` -> lists modified/untracked files or empty output if clean
- [ ] P2-003 List tracked files to detect prior backend scaffold
  Verify: Run `git ls-files | head -n 50` -> shows tracked paths or empty if nothing committed
- [ ] P2-004 Inspect docs inputs required by scaffold
  Verify: Run `ls docs/architecture.md docs/env.md docs/git-conventions.md` -> all three paths echoed, no missing file error
- [ ] P2-005 Record restore-vs-fresh decision in a scratch note
  Verify: Run `echo $SCHAFFOLD_MODE` -> outputs `restore` or `fresh` with no empty value
- [ ] P2-006 Restore tracked scaffold files if mode is restore
  Verify: Run `git restore --staged . && git status --short` -> working tree matches HEAD, no unexpected deletions

Decision rule:

```
if git log has scaffold commit and files missing from disk:
  mode=restore, run git restore / git checkout
else:
  mode=fresh, run npm/pnpm init and create files below
```

### 2.2 Backend top-level scaffold

One task per file. Keep each diff small and verifiable.

- [ ] P2-007 Initialize backend package.json when mode is fresh
  Verify: Run `test -f package.json && node -e "console.log(require('./package.json').name)"` -> prints package name, no ENOENT
- [ ] P2-008 Add dev script to package.json
  Verify: Run `node -e "console.log(require('./package.json').scripts.dev)"` -> prints `tsx watch src/server.ts` or equivalent
- [ ] P2-009 Add build script to package.json
  Verify: Run `node -e "console.log(require('./package.json').scripts.build)"` -> prints `tsc -p tsconfig.build.json`
- [ ] P2-010 Add test script to package.json
  Verify: Run `node -e "console.log(require('./package.json').scripts.test)"` -> prints `jest --runInBand`
- [ ] P2-011 Add lint script to package.json
  Verify: Run `node -e "console.log(require('./package.json').scripts.lint)"` -> prints `eslint src --ext .ts`
- [ ] P2-012 Add typecheck and format scripts to package.json
  Verify: Run `node -e "console.log(require('./package.json').scripts.typecheck)"` -> prints `tsc --noEmit`
- [ ] P2-013 Install runtime deps express cors helmet morgan dotenv
  Verify: Run `npm ls express cors helmet morgan dotenv` -> all listed with versions, no `missing` marker
- [ ] P2-014 Install dev deps typescript tsx jest eslint zod prisma
  Verify: Run `npm ls -D typescript tsx jest eslint zod` -> all listed with versions, no `missing` marker
- [ ] P2-015 Create tsconfig.json with strict mode and src include
  Verify: Run `npx tsc --showConfig | head -n 20` -> shows `strict: true` and `include: src`
- [ ] P2-016 Create tsconfig.build.json extending base without tests
  Verify: Run `test -f tsconfig.build.json && cat tsconfig.build.json` -> shows `extends` plus `exclude` for tests
- [ ] P2-017 Create eslint config for TypeScript
  Verify: Run `npx eslint --print-config src/app.ts | head -n 10` -> prints resolved config JSON, exit 0
- [ ] P2-018 Create prettier config with singleQuote and trailingComma
  Verify: Run `test -f .prettierrc && cat .prettierrc` -> shows `singleQuote` key, exit 0
- [ ] P2-019 Create jest.config.js with ts-jest and tests match
  Verify: Run `npx jest --showConfig | head -n 30` -> shows `rootDir` and `testMatch`, exit 0
- [ ] P2-020 Create .gitignore for node_modules dist env and client build
  Verify: Run `cat .gitignore` -> contains `node_modules`, `dist`, `.env`, `.next`
- [x] P2-021 Create .env.example from normative template
  Verify: Run `test -f .env.example && grep -c DATABASE_URL .env.example` -> prints count `1` or more
- [ ] P2-022 Create README.md with setup steps pointer to docs
  Verify: Run `test -f README.md && head -n 5 README.md` -> shows project title, exit 0

Reference scripts block (docs/architecture.md S16):

```json
{
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc -p tsconfig.build.json",
    "start": "node dist/server.js",
    "test": "jest --runInBand",
    "lint": "eslint src --ext .ts",
    "typecheck": "tsc --noEmit",
    "format": "prettier --write src"
  }
}
```

Reference env keys (docs/env.md S3/S4):

```
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:3000
API_VERSION=v1
DATABASE_URL=postgresql://nex:nexpass@localhost:5432/nexcommerce?schema=public
REDIS_URL=redis://localhost:6379
ELASTICSEARCH_URL=http://localhost:9200
CLICKHOUSE_URL=http://localhost:8123
```

### 2.3 Backend src layout per S8

Create only top-level files and empty dirs here. No business logic. Module internals are Phase 5.

- [ ] P2-023 Create src directory
  Verify: Run `test -d src && ls src` -> directory exists, exit 0
- [ ] P2-024 Create src/app.ts exporting Express app without listen
  Verify: Run `test -f src/app.ts && grep -q "export" src/app.ts` -> exit 0, match found
- [ ] P2-025 Create src/server.ts importing app and listening on PORT
  Verify: Run `test -f src/server.ts && grep -q "listen" src/server.ts` -> exit 0, match found
- [ ] P2-026 Create src/config directory
  Verify: Run `test -d src/config && ls src/config` -> directory exists, exit 0
- [ ] P2-027 Create src/config/env.ts with Zod fail-fast schema
  Verify: Run `test -f src/config/env.ts && grep -q "z.object" src/config/env.ts` -> exit 0, match found
- [ ] P2-028 Create src/config/logger.config.ts with pino/winston stub
  Verify: Run `test -f src/config/logger.config.ts && ls -l src/config/logger.config.ts` -> file exists with size > 0
- [ ] P2-029 Create src/config/database.config.ts exporting Prisma client singleton
  Verify: Run `test -f src/config/database.config.ts && grep -q "PrismaClient" src/config/database.config.ts` -> exit 0
- [ ] P2-030 Create src/config/redis.config.ts with REDIS_URL connection stub
  Verify: Run `test -f src/config/redis.config.ts && grep -q "REDIS_URL" src/config/redis.config.ts` -> exit 0
- [ ] P2-031 Create src/config/elasticsearch.config.ts with ELASTICSEARCH_URL stub
  Verify: Run `test -f src/config/elasticsearch.config.ts && grep -q "ELASTICSEARCH_URL" src/config/elasticsearch.config.ts` -> exit 0
- [ ] P2-032 Create src/config/pinecone.config.ts with PINECONE_API_KEY stub
  Verify: Run `test -f src/config/pinecone.config.ts && grep -q "PINECONE" src/config/pinecone.config.ts` -> exit 0
- [ ] P2-033 Create src/shared directory with .gitkeep
  Verify: Run `test -d src/shared && ls src/shared` -> shows `.gitkeep`, exit 0
- [ ] P2-034 Create src/infrastructure directory with .gitkeep
  Verify: Run `test -d src/infrastructure && ls src/infrastructure` -> shows `.gitkeep`, exit 0
- [ ] P2-035 Create src/modules directory with .gitkeep placeholder only
  Verify: Run `test -d src/modules && ls src/modules` -> shows `.gitkeep`, no per-module code yet
- [ ] P2-036 Create src/types/express.d.ts for Request augmentation
  Verify: Run `test -f src/types/express.d.ts && cat src/types/express.d.ts` -> file exists, non-empty
- [ ] P2-037 Create src/types/global.d.ts for global declarations
  Verify: Run `test -f src/types/global.d.ts && cat src/types/global.d.ts` -> file exists, non-empty
- [ ] P2-038 Create prisma directory with schema.prisma stub datasource
  Verify: Run `test -f prisma/schema.prisma && grep -q "datasource db" prisma/schema.prisma` -> exit 0
- [ ] P2-039 Create tests directories unit integration e2e with setup.ts
  Verify: Run `ls tests/unit tests/integration tests/e2e tests/setup.ts` -> all paths listed, no missing error

Minimal app.ts shape:

```ts
import express from "express";
import helmet from "helmet";
import cors from "cors";
export const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.get("/health/live", (_req, res) => res.json({ ok: true }));
```

Minimal env.ts shape (docs/env.md S12):

```ts
import { z } from "zod";
export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "staging", "production", "test"]),
  PORT: z.coerce.number().default(5000),
  DATABASE_URL: z.string().startsWith("postgresql://"),
  REDIS_URL: z.string().startsWith("redis"),
  ELASTICSEARCH_URL: z.string().url()
});
export const env = envSchema.parse(process.env);
```

### 2.4 Storefront client and support dirs

- [ ] P2-040 Scaffold Next.js storefront client in client directory
  Verify: Run `test -f client/package.json && cat client/package.json` -> shows `next` dependency, exit 0
- [ ] P2-041 Create docker scripts and workflows placeholder dirs
  Verify: Run `ls docker scripts .github/workflows 2>&1 | head -n 20` -> dirs listed or created with `.gitkeep`
- [ ] P2-042 Boot backend dev server and hit live probe
  Verify: Run `npm run dev & sleep 5; curl -s http://localhost:5000/health/live` -> returns `{"ok":true}`, then kill dev process

Boot notes:

```bash
cp .env.example .env
npm run dev
curl -s http://localhost:5000/health/live
npm run lint
npm run typecheck
npm run test -- --passWithNoTests
```

## Phase 3 - Local Infra via Docker Compose

Goal: local `docker/docker-compose.yml` per (docs/architecture.md S8/S16) providing Postgres+PostGIS, Redis, Elasticsearch/OpenSearch, and ClickHouse with named volumes, one network, healthchecks, and verified connection strings per (docs/env.md S4/S11).

Do not use production endpoints here. Local ports must match `.env.example` defaults.

Target topology:

| Service | Image family | Local port | Env key |
| :--- | :--- | :--- | :--- |
| postgres | postgis/postgis | 5432 | DATABASE_URL |
| redis | redis:7-alpine | 6379 | REDIS_URL |
| elasticsearch | elasticsearch:8.x | 9200 | ELASTICSEARCH_URL |
| clickhouse | clickhouse/clickhouse-server | 8123 | CLICKHOUSE_URL |

- [x] P3-001 Create docker directory and empty docker-compose.yml header
  Verify: Run `test -f docker/docker-compose.yml && head -n 10 docker/docker-compose.yml` -> shows `services:` key, exit 0
- [x] P3-002 Add postgres with PostGIS image and port 5432 to compose file
  Verify: Run `grep -q "postgis" docker/docker-compose.yml` -> exit 0, match found
- [x] P3-003 Add redis service with port 6379 to compose file
  Verify: Run `grep -q "redis:" docker/docker-compose.yml` -> exit 0, match found
- [x] P3-004 Add elasticsearch or opensearch service with port 9200 to compose file
  Verify: Run `grep -q "9200" docker/docker-compose.yml` -> exit 0, match found
- [x] P3-005 Add clickhouse service with HTTP port 8123 to compose file
  Verify: Run `grep -q "8123" docker/docker-compose.yml` -> exit 0, match found
- [x] P3-006 Define named volume for postgres data
  Verify: Run `grep -q "postgres_data" docker/docker-compose.yml` -> exit 0, match found
- [x] P3-007 Define named volumes for redis elasticsearch and clickhouse
  Verify: Run `grep -q "volumes:" docker/docker-compose.yml` -> exit 0, at least 3 volume entries shown
- [x] P3-008 Define single bridge network nexcommerce-net for all services
  Verify: Run `grep -q "nexcommerce-net" docker/docker-compose.yml` -> exit 0, match found
- [x] P3-009 Set postgres env POSTGRES_USER PASSWORD DB matching env.md
  Verify: Run `grep -q "POSTGRES_PASSWORD" docker/docker-compose.yml` -> exit 0, match found
- [x] P3-010 Set discovery single-node for local elasticsearch
  Verify: Run `grep -q "discovery.type=single-node" docker/docker-compose.yml` -> exit 0, match found
- [x] P3-011 Add healthcheck for postgres using pg_isready
  Verify: Run `grep -q "pg_isready" docker/docker-compose.yml` -> exit 0, match found
- [x] P3-012 Add healthcheck for redis using redis-cli ping
  Verify: Run `grep -q "redis-cli ping" docker/docker-compose.yml` -> exit 0, match found
- [x] P3-013 Add healthcheck for elasticsearch via curl localhost 9200
  Verify: Run `grep -q "healthcheck:" docker/docker-compose.yml` -> exit 0, at least 2 healthchecks present
- [x] P3-014 Add healthcheck for clickhouse via curl ping on 8123
  Verify: Run `grep -q "ping" docker/docker-compose.yml` -> exit 0, clickhouse ping entry found
- [x] P3-015 Validate compose file config without starting containers
  Verify: Run `docker compose -f docker/docker-compose.yml config` -> prints resolved YAML, exit 0
- [x] P3-016 Start all infra containers in detached mode
  Verify: Run `docker compose -f docker/docker-compose.yml up -d` -> output `Started` or `Running`, exit 0
- [x] P3-017 Verify postgres container shows healthy status
  Verify: Run `docker ps --format "{{.Names}} {{.Status}}"` -> shows `healthy` for postgres container
- [x] P3-018 Verify redis container shows healthy or running status
  Verify: Run `docker ps --format "{{.Names}} {{.Status}}"` -> shows redis container as `Up`
- [x] P3-019 Verify elasticsearch container responds on port 9200
  Verify: Run `curl -s http://localhost:9200 | head -n 5` -> shows `cluster_name` JSON, exit 0
- [x] P3-020 Verify clickhouse container responds on port 8123
  Verify: Run `curl -s http://localhost:8123/ping` -> returns `Ok.`, exit 0
- [x] P3-021 Verify postgres connection with pg_isready on localhost 5432
  Verify: Run `pg_isready -h localhost -p 5432` -> returns `accepting connections`, exit 0
- [x] P3-022 Verify redis connection with ping command
  Verify: Run `redis-cli -h localhost -p 6379 ping` -> returns `PONG`, exit 0
- [x] P3-023 Verify DATABASE_URL from env.md connects via psql select 1
  Verify: Run `docker exec docker-postgres-1 psql "postgresql://nex:nexpass@localhost:5432/nexcommerce" -c "SELECT 1;"` -> returns `1 row`, exit 0 (NOTE: strip Prisma's `?schema=public` suffix, real psql rejects it as an invalid URI parameter)
- [x] P3-024 Verify REDIS_URL matches compose mapping and local env file
  Verify: Run `grep -q "redis://localhost:6379" .env.example` -> exit 0, match found
- [x] P3-025 Verify ELASTICSEARCH_URL and CLICKHOUSE_URL defaults in env file
  Verify: Run `grep -E "ELASTICSEARCH_URL|CLICKHOUSE_URL" .env.example` -> shows both URLs with localhost ports
- [x] P3-026 Document local ports table in docker README or compose comments
  Verify: Run `grep -E "5432|6379|9200|8123" docker/docker-compose.yml` -> all four ports found, exit 0
- [x] P3-027 Stop and restart stack to prove idempotent boot
  Verify: Run `docker compose -f docker/docker-compose.yml restart` -> all services restart, exit 0
- [x] P3-028 Run final docker ps healthy gate before Phase 4
  Verify: Run `docker ps --format "{{.Names}} {{.Status}}"` -> all 4 services listed as `Up`, zero exited

Example compose skeleton:

```yaml
services:
  postgres:
    image: postgis/postgis:16-3.4
    ports: ["5432:5432"]
    environment:
      POSTGRES_USER: nex
      POSTGRES_PASSWORD: nexpass
      POSTGRES_DB: nexcommerce
    volumes: [postgres_data:/var/lib/postgresql/data]
    networks: [nexcommerce-net]
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U nex"]
      interval: 5s
      retries: 10
  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]
    volumes: [redis_data:/data]
    networks: [nexcommerce-net]
volumes:
  postgres_data: {}
  redis_data: {}
networks:
  nexcommerce-net:
    driver: bridge
```

Local verification sequence (docs/architecture.md S16):

```bash
docker compose -f docker/docker-compose.yml config
docker compose -f docker/docker-compose.yml up -d
docker ps --format "{{.Names}} {{.Status}}"
pg_isready -h localhost -p 5432
redis-cli -h localhost -p 6379 ping
curl -s http://localhost:9200
curl -s http://localhost:8123/ping
```

## Phase 4 - Environment Configuration (per docs/env.md)

Scope: server, data stores, auth, OAuth, AI, payments, messaging, maps/AWS, observability. All values load via Zod-validated env.ts with fail-fast boot. See (docs/env.md S1) for principles, (docs/architecture.md ADR-001) for module boundaries.

| Group | Env vars covered | Task IDs |
| --- | --- | --- |
| Server core | NODE_ENV, PORT, API_VERSION, CLIENT_URL | P4-001 |
| Postgres | DATABASE_URL, pool sizes | P4-002 |
| Redis | REDIS_URL | P4-003 |
| Elasticsearch | ELASTICSEARCH_URL, index name | P4-004 |
| ClickHouse | CLICKHOUSE_URL, DB, user | P4-005 |
| Auth JWT | JWT_SECRET, JWT_EXPIRES_IN, REFRESH_SECRET | P4-006 |
| Google OAuth | GOOGLE_CLIENT_ID, SECRET, CALLBACK | P4-007 |
| OpenAI | OPENAI_API_KEY, OPENAI_MODEL | P4-008 |
| Pinecone | PINECONE_API_KEY, INDEX, ENV | P4-009 |
| Stripe | STRIPE_SECRET_KEY, WEBHOOK_SECRET, CONNECT | P4-010 |
| SendGrid | SENDGRID_API_KEY, FROM email | P4-011 |
| Twilio+FCM | TWILIO_*, FIREBASE_SERVER_KEY | P4-012 |
| Maps+AWS | GOOGLE_MAPS_KEY, AWS_*, bucket | P4-013 |
| Observability | LOG_LEVEL, SENTRY_DSN | P4-014 |

- [ ] P4-001 Set server core variables NODE_ENV PORT CLIENT_URL API_VERSION per (docs/env.md S3)
  Verify: Run `grep -E "NODE_ENV|PORT|CLIENT_URL|API_VERSION" .env.example` -> shows all four lines
- [ ] P4-002 Set Postgres group DATABASE_URL plus pool min/max per (docs/env.md S4)
  Verify: Run `grep DATABASE_URL .env.example` -> shows postgresql:// URL entry
- [ ] P4-003 Set Redis group REDIS_URL per (docs/env.md S4)
  Verify: Run `grep REDIS_URL .env.example` -> shows redis://localhost:6379 entry
- [ ] P4-004 Set Elasticsearch group ELASTICSEARCH_URL plus index name per (docs/env.md S4)
  Verify: Run `grep ELASTICSEARCH_URL .env.example` -> shows http://localhost:9200 entry
- [ ] P4-005 Set ClickHouse group CLICKHOUSE_URL DB USER per (docs/env.md S4)
  Verify: Run `grep CLICKHOUSE_URL .env.example` -> shows http://localhost:8123 entry
- [ ] P4-006 Set auth JWT group JWT_SECRET JWT_EXPIRES_IN REFRESH_SECRET REFRESH_EXPIRES_IN per (docs/env.md S5)
  Verify: Run `grep JWT_SECRET .env.example` -> shows JWT_SECRET entry with 32+ char placeholder
- [ ] P4-007 Set Google OAuth group GOOGLE_CLIENT_ID SECRET CALLBACK per (docs/env.md S5)
  Verify: Run `grep GOOGLE_CLIENT_ID .env.example` -> shows client id entry
- [ ] P4-008 Set OpenAI group OPENAI_API_KEY OPENAI_MODEL per (docs/env.md S6)
  Verify: Run `grep OPENAI_API_KEY .env.example` -> shows sk- placeholder entry
- [ ] P4-009 Set Pinecone group PINECONE_API_KEY PINECONE_INDEX PINECONE_ENV per (docs/env.md S6)
  Verify: Run `grep PINECONE_API_KEY .env.example` -> shows Pinecone key entry
- [ ] P4-010 Set Stripe group STRIPE_SECRET_KEY STRIPE_WEBHOOK_SECRET STRIPE_CONNECT_CLIENT per (docs/env.md S7)
  Verify: Run `grep STRIPE_SECRET_KEY .env.example` -> shows sk_test_ placeholder entry
- [ ] P4-011 Set SendGrid group SENDGRID_API_KEY SENDGRID_FROM_EMAIL per (docs/env.md S8)
  Verify: Run `grep SENDGRID_API_KEY .env.example` -> shows SG. placeholder entry
- [ ] P4-012 Set Twilio and FCM group TWILIO_ACCOUNT_SID TWILIO_AUTH_TOKEN TWILIO_PHONE FIREBASE_SERVER_KEY per (docs/env.md S8)
  Verify: Run `grep TWILIO_ACCOUNT_SID .env.example` -> shows AC placeholder entry
- [ ] P4-013 Set Maps and AWS group GOOGLE_MAPS_KEY AWS_ACCESS_KEY AWS_SECRET_KEY AWS_BUCKET_NAME AWS_REGION per (docs/env.md S8)
  Verify: Run `grep AWS_BUCKET_NAME .env.example` -> shows bucket entry
- [ ] P4-014 Set observability group LOG_LEVEL SENTRY_DSN per (docs/env.md S9)
  Verify: Run `grep LOG_LEVEL .env.example` -> shows LOG_LEVEL entry
- [ ] P4-015 Set feature-flag and tuning group ENABLE_SEMANTIC_SEARCH CART_TTL_MIN per (docs/env.md S10)
  Verify: Run `grep ENABLE_SEMANTIC_SEARCH .env.example` -> shows flag entry
- [x] P4-016 Verify .env.example template has all groups with placeholder values per (docs/env.md S13)
  Verify: Run `test -f .env.example && grep -c "=" .env.example` -> count 25 or more lines with =
- [ ] P4-017 Verify src/config/env.ts Zod schema validates every .env.example key per (docs/env.md S12)
  Verify: Run `test -f src/config/env.ts && grep -q "z.object" src/config/env.ts` -> exit 0
- [ ] P4-018 Add boot fail-fast test that exits non-zero when required env is missing per (docs/env.md S12)
  Verify: Run `npm test -- env.failfast.test.ts` -> shows 1 passed fail-fast case

Example .env.example snippet expected after P4-016:

```
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:3000
API_VERSION=v1
DATABASE_URL=postgresql://nex:nexpass@localhost:5432/nexcommerce?schema=public
REDIS_URL=redis://localhost:6379
JWT_SECRET=change-me-min-32-chars-dev-only
```

Example env.ts shape expected after P4-017:

```ts
import { z } from "zod";
export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "staging", "production", "test"]),
  PORT: z.coerce.number().default(5000),
  DATABASE_URL: z.string().startsWith("postgresql://")
});
export const env = envSchema.parse(process.env);
```

## Phase 5 - Backend Foundation Deps Config Middleware CI Hooks

Scope: Express bootstrap, Prisma, queues, external SDKs, testing, lint, Husky, health, RBAC stub, rate-limit stub, CI. Error shape follows (docs/error-codes.md S2). Commits follow (docs/git-conventions.md S13).

- [ ] P5-001 Install runtime core deps express cors helmet zod dotenv per architecture bootstrap
  Verify: Run `npm ls express zod` -> shows express@4.x and zod@3.x installed
- [ ] P5-002 Install Prisma deps prisma @prisma/client as data layer foundation
  Verify: Run `npm ls @prisma/client` -> shows @prisma/client version line
- [ ] P5-003 Install Redis and queue deps ioredis bullmq
  Verify: Run `npm ls bullmq ioredis` -> shows both packages installed
- [ ] P5-004 Install Stripe SDK stripe with pinned major version
  Verify: Run `npm ls stripe` -> shows stripe version line
- [ ] P5-005 Install AI deps openai @pinecone-database/pinecone
  Verify: Run `npm ls openai` -> shows openai package version line
- [ ] P5-006 Install messaging deps @sendgrid/mail twilio firebase-admin
  Verify: Run `npm ls @sendgrid/mail twilio` -> shows both installed
- [ ] P5-007 Install test deps jest ts-jest @types/jest supertest @types/supertest
  Verify: Run `npm ls jest supertest` -> shows jest and supertest versions
- [ ] P5-008 Install lint-format deps eslint prettier typescript @types/express @types/node
  Verify: Run `npm ls eslint prettier` -> shows eslint and prettier versions
- [ ] P5-009 Install git-hook deps husky commitlint lint-staged
  Verify: Run `npm ls husky @commitlint/cli` -> shows husky and commitlint installed
- [ ] P5-010 Create src/config/logger.ts using pino with LOG_LEVEL from env
  Verify: Run `test -f src/config/logger.ts && grep -q "pino" src/config/logger.ts` -> exit 0
- [ ] P5-011 Add logger unit smoke test writing one info log without throw
  Verify: Run `npm test -- logger.test.ts` -> shows 1 passed
- [ ] P5-012 Create src/config/prisma.ts exporting singleton PrismaClient
  Verify: Run `test -f src/config/prisma.ts && grep -q "PrismaClient" src/config/prisma.ts` -> exit 0
- [ ] P5-013 Add prisma connect-disconnect helper with error logging
  Verify: Run `grep -q "connect" src/config/prisma.ts` -> exit 0
- [ ] P5-014 Create src/errors/AppError.ts with code statusCode details per (docs/error-codes.md S2)
  Verify: Run `test -f src/errors/AppError.ts && grep -q "class AppError" src/errors/AppError.ts` -> exit 0
- [ ] P5-015 Create src/middleware/errorHandler.ts mapping AppError to envelope per (docs/error-codes.md S2)
  Verify: Run `test -f src/middleware/errorHandler.ts && grep -q "errorHandler" src/middleware/errorHandler.ts` -> exit 0
- [ ] P5-016 Add error envelope test asserting code message requestId fields per (docs/error-codes.md S2)
  Verify: Run `npm test -- errorHandler.test.ts` -> shows 2 passed
- [ ] P5-017 Create src/middleware/requestId.ts generating X-Request-Id with uuid
  Verify: Run `test -f src/middleware/requestId.ts && grep -q "X-Request-Id" src/middleware/requestId.ts` -> exit 0
- [ ] P5-018 Add requestId header propagation test via supertest
  Verify: Run `npm test -- requestId.test.ts` -> shows X-Request-Id header present
- [ ] P5-019 Create src/routes/health.ts with GET /health/live returning 200 ok
  Verify: Run `grep -q "/health/live" src/routes/health.ts` -> exit 0
- [ ] P5-020 Add GET /health/ready checking prisma and redis connectivity
  Verify: Run `grep -q "/health/ready" src/routes/health.ts` -> exit 0
- [ ] P5-021 Wire health router into Express app in src/app.ts
  Verify: Run `grep -q "health" src/app.ts` -> exit 0
- [ ] P5-022 Add health endpoint integration test for live and ready per boot contract
  Verify: Run `npm test -- health.test.ts` -> shows 2 passed live and ready
- [ ] P5-023 Create src/middleware/rbac.ts stub with requireRole function
  Verify: Run `test -f src/middleware/rbac.ts && grep -q "requireRole" src/middleware/rbac.ts` -> exit 0
- [ ] P5-024 Add RBAC stub unit test for allow and deny paths
  Verify: Run `npm test -- rbac.test.ts` -> shows 2 passed
- [ ] P5-025 Create src/middleware/rateLimit.ts stub exporting basic limiter config
  Verify: Run `test -f src/middleware/rateLimit.ts && grep -q "rateLimit" src/middleware/rateLimit.ts` -> exit 0
- [ ] P5-026 Add rate-limit stub test asserting 429 shape matches envelope per (docs/error-codes.md S2)
  Verify: Run `npm test -- rateLimit.test.ts` -> shows 1 passed
- [ ] P5-027 Create src/app.ts wiring helmet cors json requestId logger errorHandler
  Verify: Run `test -f src/app.ts && grep -q "helmet" src/app.ts` -> exit 0
- [ ] P5-028 Create src/server.ts loading env first then listening on PORT
  Verify: Run `test -f src/server.ts && grep -q "env.PORT" src/server.ts` -> exit 0
- [ ] P5-029 Verify tsconfig.json has strict true and moduleResolution node
  Verify: Run `test -f tsconfig.json && grep -q '"strict": true' tsconfig.json` -> exit 0
- [ ] P5-030 Verify eslint config extends recommended and prettier
  Verify: Run `grep -q "prettier" .eslintrc.json eslint.config.mjs 2>/dev/null` -> shows prettier entry
- [ ] P5-031 Verify .prettierrc has singleQuote and trailingComma settings
  Verify: Run `cat .prettierrc 2>/dev/null` -> shows singleQuote true
- [ ] P5-032 Verify jest.config.js has ts-jest preset and testMatch
  Verify: Run `test -f jest.config.js && grep -q "ts-jest" jest.config.js` -> exit 0
- [ ] P5-033 Create prisma/schema.prisma with datasource postgres and generator client
  Verify: Run `test -f prisma/schema.prisma && grep -q "datasource db" prisma/schema.prisma` -> exit 0
- [ ] P5-034 Create .github/workflows/ci.yml workflow file skeleton with push trigger
  Verify: Run `test -f .github/workflows/ci.yml && grep -q "on: push" .github/workflows/ci.yml` -> exit 0
- [ ] P5-035 Add CI lint job running eslint per pipeline contract
  Verify: Run `grep -q "npm run lint" .github/workflows/ci.yml` -> exit 0
- [ ] P5-036 Add CI typecheck job running tsc --noEmit
  Verify: Run `grep -q "tsc --noEmit" .github/workflows/ci.yml` -> exit 0
- [ ] P5-037 Add CI test job running npm test with postgres and redis services
  Verify: Run `grep -q "npm test" .github/workflows/ci.yml` -> exit 0
- [ ] P5-038 Add CI build job running npm run build
  Verify: Run `grep -q "npm run build" .github/workflows/ci.yml` -> exit 0
- [ ] P5-039 Add CI migrate-check job running prisma validate and migrate diff
  Verify: Run `grep -q "prisma validate" .github/workflows/ci.yml` -> exit 0
- [ ] P5-040 Create commitlint.config.js with conventional-commits per (docs/git-conventions.md S13)
  Verify: Run `test -f commitlint.config.js && grep -q "conventional" commitlint.config.js` -> exit 0
- [ ] P5-041 Add Husky pre-commit hook running lint-staged per (docs/git-conventions.md S13)
  Verify: Run `test -f .husky/pre-commit && grep -q "lint-staged" .husky/pre-commit` -> exit 0
- [ ] P5-042 Add Husky commit-msg hook running commitlint per (docs/git-conventions.md S13)
  Verify: Run `test -f .husky/commit-msg && grep -q "commitlint" .husky/commit-msg` -> exit 0
- [ ] P5-043 Add lint-staged config for eslint and prettier on staged files per (docs/git-conventions.md S13)
  Verify: Run `grep -q "lint-staged" package.json` -> shows lint-staged block
- [ ] P5-044 Verify npm scripts lint typecheck test build exist in package.json
  Verify: Run `grep -q '"lint"' package.json` -> shows lint script line
- [ ] P5-045 Verify full local pipeline lint typecheck test build passes once
  Verify: Run `npm run lint && npm run typecheck && npm test && npm run build` -> all exit 0

## Wave 1 - Auth (US-001 to US-006)

Scope: register, login, session refresh, logout, OAuth, OTP, password reset, me, email verify. Spec: docs/prd.md US-001..US-006, FR-001..FR-005, docs/api.md S5, docs/ui-flows.md S7 S8, docs/error-codes.md S5, docs/architecture.md S7.

| US | FR | API | UI | Tasks |
| :--- | :--- | :--- | :--- | :--- |
| US-001 register | FR-001 FR-004 | S5 POST /auth/register | S7 S8 /register | AUTH-001 AUTH-002 AUTH-013 AUTH-021 |
| US-002 login | FR-001 FR-003 | S5 POST /auth/login | S7 S8 /login | AUTH-003 AUTH-014 AUTH-017 AUTH-022 |
| US-003 OAuth Google | FR-002 | S5 GET /auth/google + callback | S7 /login | AUTH-006 AUTH-007 AUTH-023 |
| US-004 OTP phone | FR-003 | S5 POST /auth/verify-otp | S8 /verify-phone | AUTH-008 AUTH-018 AUTH-026 |
| US-005 reset + verify | FR-004 | S5 forgot reset verify-email | S8 /forgot-password /reset-password/:token /verify-email | AUTH-009 AUTH-010 AUTH-012 AUTH-019 |
| US-006 session me | FR-003 FR-005 | S5 refresh logout me | S7 guards S8 /403 /404 | AUTH-004 AUTH-005 AUTH-011 AUTH-015 AUTH-016 |

### Wave 1 migration

- [ ] AUTH-001 Add Prisma models User Session RefreshToken and run migrate dev wave1-auth plus prisma generate (US-001, FR-001) (docs/api.md S5) (docs/ui-flows.md S7)
  Verify: Run `npx prisma validate` -> OK and `npx prisma migrate dev --name wave1-auth` -> Applied and `npx prisma generate` -> Generated
### Wave 1 endpoints

- [ ] AUTH-002 Implement POST /auth/register with password policy and cart merge stub (US-001, FR-001 FR-004) (docs/api.md S5) (docs/ui-flows.md S7) Errors AUTH_EMAIL_EXISTS AUTH_PASSWORD_WEAK VALIDATION_FAILED AUTH_RATE_LIMITED
  Verify: Run `npm run test -- auth.register` -> PASS and curl POST /api/v1/auth/register -> 201 with accessToken
- [ ] AUTH-003 Implement POST /auth/login with generic error and cart merge (US-002, FR-001) (docs/api.md S5) (docs/ui-flows.md S7) Errors AUTH_INVALID_CREDENTIALS AUTH_ACCOUNT_SUSPENDED AUTH_EMAIL_NOT_VERIFIED AUTH_RATE_LIMITED
  Verify: Run `npm run test -- auth.login` -> PASS and curl POST /api/v1/auth/login -> 200 or 401 generic
- [ ] AUTH-004 Implement POST /auth/refresh with rotation and reuse detection (US-006, FR-003) (docs/api.md S5) (docs/ui-flows.md S7) Errors AUTH_REFRESH_INVALID AUTH_SESSION_REVOKED AUTH_TOKEN_EXPIRED
  Verify: Run `npm run test -- auth.refresh` -> PASS and curl POST /api/v1/auth/refresh -> 200 rotates pair
- [ ] AUTH-005 Implement POST /auth/logout revoking session in Redis (US-006, FR-003) (docs/api.md S5) (docs/ui-flows.md S7) Errors UNAUTHORIZED AUTH_SESSION_REVOKED
  Verify: Run `npm run test -- auth.logout` -> PASS and curl POST /api/v1/auth/logout -> 200 revoked
- [ ] AUTH-006 Implement GET /auth/google 302 redirect to consent (US-003, FR-002) (docs/api.md S5) (docs/ui-flows.md S7) Errors AUTH_OAUTH_LINK_FAILED RATE_LIMITED
  Verify: Run `npm run test -- auth.google` -> PASS and curl GET /api/v1/auth/google -> 302 Location google
- [ ] AUTH-007 Implement POST /auth/oauth/:provider/callback code exchange and link by verified email (US-003, FR-002) (docs/api.md S5) (docs/ui-flows.md S7) Errors AUTH_OAUTH_LINK_FAILED VALIDATION_FAILED
  Verify: Run `npm run test -- auth.oauth-callback` -> PASS and curl POST /api/v1/auth/oauth/google/callback -> 200 JWT pair
- [ ] AUTH-008 Implement POST /auth/verify-otp marking phone verified (US-004, FR-003) (docs/api.md S5) (docs/ui-flows.md S8) Errors AUTH_OTP_INVALID AUTH_OTP_EXPIRED AUTH_RATE_LIMITED
  Verify: Run `npm run test -- auth.verify-otp` -> PASS and curl POST /api/v1/auth/verify-otp -> 200 verified
- [ ] AUTH-009 Implement POST /auth/forgot-password always 200 no enumeration (US-005, FR-004) (docs/api.md S5) (docs/ui-flows.md S7) Errors AUTH_RATE_LIMITED RATE_LIMITED
  Verify: Run `npm run test -- auth.forgot` -> PASS and curl POST /api/v1/auth/forgot-password -> 200 If account exists
- [ ] AUTH-010 Implement POST /auth/reset-password revoking all sessions plus auto-login (US-005, FR-004) (docs/api.md S5) (docs/ui-flows.md S7) Errors AUTH_TOKEN_INVALID VALIDATION_FAILED AUTH_PASSWORD_WEAK
  Verify: Run `npm run test -- auth.reset` -> PASS and curl POST /api/v1/auth/reset-password -> 200 auto-login
- [ ] AUTH-011 Implement GET /auth/me returning id email role verification flags (US-006, FR-005) (docs/api.md S5) (docs/ui-flows.md S7) Errors UNAUTHORIZED AUTH_TOKEN_EXPIRED AUTH_TOKEN_INVALID
  Verify: Run `npm run test -- auth.me` -> PASS and curl GET /api/v1/auth/me -> 200 user object
- [ ] AUTH-012 Implement POST /auth/verify-email marking email verified (US-005, FR-001) (docs/api.md S5) (docs/ui-flows.md S8) Errors AUTH_TOKEN_INVALID AUTH_OTP_EXPIRED VALIDATION_FAILED
  Verify: Run `npm run test -- auth.verify-email` -> PASS and curl POST /api/v1/auth/verify-email -> 200 verified
### Wave 1 tests

- [ ] AUTH-013 Test password policy rejects weak passwords 12 char rule (US-001, FR-004) (docs/api.md S5) (docs/ui-flows.md S7) Errors AUTH_PASSWORD_WEAK
  Verify: Run `npm run test -- auth.password-policy` -> PASS 4 weak cases rejected
- [ ] AUTH-014 Test login returns generic invalid creds no enumeration (US-002, FR-001) (docs/api.md S5) (docs/ui-flows.md S7) Errors AUTH_INVALID_CREDENTIALS
  Verify: Run `npm run test -- auth.generic-creds` -> PASS same message bad email and bad password
- [ ] AUTH-015 Test silent refresh on 401 AUTH_TOKEN_EXPIRED retries once (US-006, FR-003) (docs/api.md S5) (docs/ui-flows.md S7) Errors AUTH_TOKEN_EXPIRED AUTH_REFRESH_INVALID
  Verify: Run `npm run test -- auth.silent-refresh` -> PASS retry succeeds then forces logout on bad refresh
- [ ] AUTH-016 Test RBAC 403 AUTH_INSUFFICIENT_ROLE for wrong role (US-006, FR-005) (docs/api.md S5) (docs/ui-flows.md S7) Errors AUTH_INSUFFICIENT_ROLE FORBIDDEN
  Verify: Run `npm run test -- auth.rbac` -> PASS customer blocked from vendor route 403
- [ ] AUTH-017 Test rate limit 429 after 5 login attempts per 15min (US-002, FR-001) (docs/api.md S5) (docs/ui-flows.md S7) Errors AUTH_RATE_LIMITED RATE_LIMITED
  Verify: Run `npm run test -- auth.rate-limit` -> PASS 6th request returns 429
- [ ] AUTH-018 Test OTP invalid retry and expired resend paths (US-004, FR-003) (docs/api.md S5) (docs/ui-flows.md S8) Errors AUTH_OTP_INVALID AUTH_OTP_EXPIRED
  Verify: Run `npm run test -- auth.otp` -> PASS invalid 400 and expired 400 with resend hint
- [ ] AUTH-019 Test email-not-verified gate blocks login with resend hint (US-005, FR-001) (docs/api.md S5) (docs/ui-flows.md S7) Errors AUTH_EMAIL_NOT_VERIFIED
  Verify: Run `npm run test -- auth.email-gate` -> PASS 403 with resendLink field
- [ ] AUTH-020 Test suspended and revoked session force logout (US-006, FR-005) (docs/api.md S5) (docs/ui-flows.md S7) Errors AUTH_ACCOUNT_SUSPENDED AUTH_SESSION_REVOKED
  Verify: Run `npm run test -- auth.suspended` -> PASS 403 suspended and 401 revoked
### Wave 1 UI screens

- [ ] AUTH-021 Build Register screen at /register with policy checklist (US-001, FR-004) (docs/api.md S5) (docs/ui-flows.md S8) Errors AUTH_EMAIL_EXISTS AUTH_PASSWORD_WEAK
  Verify: Run dev and open /register -> renders and e2e register flow -> toast Verification email sent
- [ ] AUTH-022 Build Login screen at /login with forgot link and Google button (US-002, FR-002) (docs/api.md S5) (docs/ui-flows.md S8) Errors AUTH_INVALID_CREDENTIALS AUTH_RATE_LIMITED
  Verify: Run dev and open /login -> renders and e2e bad creds -> generic error shown
- [ ] AUTH-023 Build Forgot Password screen at /forgot-password with sent state (US-005, FR-004) (docs/api.md S5) (docs/ui-flows.md S8) Errors AUTH_RATE_LIMITED
  Verify: Run dev and open /forgot-password -> renders and submit -> If account exists message
- [ ] AUTH-024 Build Reset Password screen at /reset-password/:token with auto-login (US-005, FR-004) (docs/api.md S5) (docs/ui-flows.md S8) Errors AUTH_TOKEN_INVALID AUTH_PASSWORD_WEAK
  Verify: Run dev and open /reset-password/x -> renders and submit valid -> redirects /home
- [ ] AUTH-025 Build Email Verification screen at /verify-email with resend (US-005, FR-001) (docs/api.md S5) (docs/ui-flows.md S8) Errors AUTH_TOKEN_INVALID AUTH_OTP_EXPIRED
  Verify: Run dev and open /verify-email -> renders and valid token -> verified state
- [ ] AUTH-026 Build Phone OTP screen at /verify-phone with retry counter (US-004, FR-003) (docs/api.md S5) (docs/ui-flows.md S8) Errors AUTH_OTP_INVALID AUTH_OTP_EXPIRED
  Verify: Run dev and open /verify-phone -> renders and wrong OTP -> inline retry error
- [ ] AUTH-027 Build 403 Forbidden screen at /403 with switch account (US-006, FR-005) (docs/api.md S5) (docs/ui-flows.md S8) Errors AUTH_INSUFFICIENT_ROLE FORBIDDEN
  Verify: Run dev and open /403 -> renders and role-guard redirect -> /403 shown
- [ ] AUTH-028 Build 404 Not Found screen at catch-all with search box (US-006, FR-005) (docs/api.md S5) (docs/ui-flows.md S8) Errors NOT_FOUND
  Verify: Run dev and open /nope-123 -> renders 404 with home link
- [ ] AUTH-029 Build 500 Error and Maintenance screens at /500 and /maintenance (US-006, FR-005) (docs/api.md S5) (docs/ui-flows.md S8) Errors INTERNAL_ERROR MAINTENANCE_MODE
  Verify: Run dev and open /500 -> renders Ref requestId and /maintenance -> countdown shown
### Wave 1 close

- [ ] AUTH-030 Update docs/progress.md checkboxes for Auth US-001..US-006 complete (US-006, FR-005) (docs/api.md S5) (docs/ui-flows.md S7)
  Verify: Run `grep -n Auth docs/progress.md` -> shows checked boxes and `git diff --stat` -> progress.md modified

## Wave 2 - User (US-007 to US-011)

Scope: profile, avatar, addresses, preferences, wishlist, GDPR export, delete. Spec: docs/prd.md US-007..US-011, FR-006..FR-010, docs/api.md S6, docs/ui-flows.md S7 S8, docs/error-codes.md S10, docs/architecture.md S7.

| US | FR | API | UI | Tasks |
| :--- | :--- | :--- | :--- | :--- |
| US-007 profile | FR-006 | S6 GET PUT /users/me | S8 /profile /profile/setup | USER-001 USER-002 USER-003 USER-024 |
| US-008 addresses | FR-007 FR-008 | S6 addresses x4 | S8 /addresses | USER-005 USER-006 USER-007 USER-008 USER-016 |
| US-009 preferences | FR-009 | S6 prefs GET PUT | S8 /notifications | USER-009 USER-010 USER-028 |
| US-010 wishlist avatar | FR-010 | S6 avatar wishlist x3 | S8 /wishlist /profile | USER-004 USER-011 USER-012 USER-013 USER-017 |
| US-011 GDPR | FR-010 | S6 export delete | S8 /profile | USER-014 USER-015 USER-022 USER-023 |

### Wave 2 migration

- [ ] USER-001 Add Prisma models UserAddress UserPreference and run migrate dev wave2-user plus prisma generate (US-007, FR-006) (docs/api.md S6) (docs/ui-flows.md S8)
  Verify: Run `npx prisma validate` -> OK and `npx prisma migrate dev --name wave2-user` -> Applied and `npx prisma generate` -> Generated
### Wave 2 endpoints

- [ ] USER-002 Implement GET /users/me returning profile with defaultAddressId (US-007, FR-006) (docs/api.md S6) (docs/ui-flows.md S8) Errors UNAUTHORIZED USER_NOT_FOUND
  Verify: Run `npm run test -- user.get-me` -> PASS and curl GET /api/v1/users/me -> 200 profile
- [ ] USER-003 Implement PUT /users/me updating firstName lastName phone (US-007, FR-006) (docs/api.md S6) (docs/ui-flows.md S8) Errors VALIDATION_FAILED UNAUTHORIZED
  Verify: Run `npm run test -- user.put-me` -> PASS and curl PUT /api/v1/users/me -> 200 updated
- [ ] USER-004 Implement POST /users/me/avatar multipart 2MB S3 upload (US-010, FR-010) (docs/api.md S6) (docs/ui-flows.md S8) Errors USER_AVATAR_TOO_LARGE VALIDATION_FAILED UNAUTHORIZED
  Verify: Run `npm run test -- user.avatar` -> PASS and curl POST /api/v1/users/me/avatar -> 200 avatarUrl
- [ ] USER-005 Implement GET /users/me/addresses listing with isDefault lat lng (US-008, FR-007) (docs/api.md S6) (docs/ui-flows.md S8) Errors UNAUTHORIZED USER_NOT_FOUND
  Verify: Run `npm run test -- user.list-addresses` -> PASS and curl GET /api/v1/users/me/addresses -> 200 array
- [ ] USER-006 Implement POST /users/me/addresses with async geocode queue (US-008, FR-007 FR-008) (docs/api.md S6) (docs/ui-flows.md S8) Errors USER_ADDRESS_INVALID USER_DEFAULT_ADDRESS_REQUIRED VALIDATION_FAILED
  Verify: Run `npm run test -- user.add-address` -> PASS and curl POST /api/v1/users/me/addresses -> 201 address
- [ ] USER-007 Implement PUT /users/me/addresses/:id updating address and default flip (US-008, FR-008) (docs/api.md S6) (docs/ui-flows.md S8) Errors USER_ADDRESS_NOT_FOUND USER_DEFAULT_ADDRESS_REQUIRED VALIDATION_FAILED
  Verify: Run `npm run test -- user.update-address` -> PASS and curl PUT /api/v1/users/me/addresses/1 -> 200 updated
- [ ] USER-008 Implement DELETE /users/me/addresses/:id logical delete with default reassign (US-008, FR-008) (docs/api.md S6) (docs/ui-flows.md S8) Errors USER_ADDRESS_NOT_FOUND USER_DEFAULT_ADDRESS_REQUIRED UNAUTHORIZED
  Verify: Run `npm run test -- user.delete-address` -> PASS and curl DELETE /api/v1/users/me/addresses/1 -> 200 deleted true
- [ ] USER-009 Implement GET /users/me/preferences returning channels (US-009, FR-009) (docs/api.md S6) (docs/ui-flows.md S8) Errors UNAUTHORIZED USER_NOT_FOUND
  Verify: Run `npm run test -- user.get-prefs` -> PASS and curl GET /api/v1/users/me/preferences -> 200 prefs
- [ ] USER-010 Implement PUT /users/me/preferences saving email sms push marketing (US-009, FR-009) (docs/api.md S6) (docs/ui-flows.md S8) Errors USER_PREFERENCES_INVALID VALIDATION_FAILED
  Verify: Run `npm run test -- user.put-prefs` -> PASS and curl PUT /api/v1/users/me/preferences -> 200 saved
- [ ] USER-011 Implement GET /users/me/wishlist listing saved products (US-010, FR-010) (docs/api.md S6) (docs/ui-flows.md S8) Errors UNAUTHORIZED USER_NOT_FOUND
  Verify: Run `npm run test -- user.list-wishlist` -> PASS and curl GET /api/v1/users/me/wishlist -> 200 list
- [ ] USER-012 Implement POST /users/me/wishlist adding productId (US-010, FR-010) (docs/api.md S6) (docs/ui-flows.md S8) Errors PRODUCT_NOT_FOUND VALIDATION_FAILED UNAUTHORIZED
  Verify: Run `npm run test -- user.add-wishlist` -> PASS and curl POST /api/v1/users/me/wishlist -> 201 added
- [ ] USER-013 Implement DELETE /users/me/wishlist/:productId removing item (US-010, FR-010) (docs/api.md S6) (docs/ui-flows.md S8) Errors PRODUCT_NOT_FOUND USER_NOT_FOUND UNAUTHORIZED
  Verify: Run `npm run test -- user.remove-wishlist` -> PASS and curl DELETE /api/v1/users/me/wishlist/p1 -> 200 removed
- [ ] USER-014 Implement POST /users/me/export async GDPR job returning jobId (US-011, FR-010) (docs/api.md S6) (docs/ui-flows.md S8) Errors UNAUTHORIZED USER_NOT_FOUND USER_EXPORT_PENDING
  Verify: Run `npm run test -- user.export` -> PASS and curl POST /api/v1/users/me/export -> 202 jobId
- [ ] USER-015 Implement DELETE /users/me soft-delete plus anonymize orders (US-011, FR-010) (docs/api.md S6) (docs/ui-flows.md S8) Errors USER_ALREADY_DELETED UNAUTHORIZED USER_NOT_FOUND
  Verify: Run `npm run test -- user.delete` -> PASS and curl DELETE /api/v1/users/me -> 200 anonymized
### Wave 2 tests

- [ ] USER-016 Test default-address invariant exactly one default (US-008, FR-008) (docs/api.md S6) (docs/ui-flows.md S8) Errors USER_DEFAULT_ADDRESS_REQUIRED
  Verify: Run `npm run test -- user.default-invariant` -> PASS add second default flips first
- [ ] USER-017 Test avatar size rejects over 2MB file (US-010, FR-010) (docs/api.md S6) (docs/ui-flows.md S8) Errors USER_AVATAR_TOO_LARGE
  Verify: Run `npm run test -- user.avatar-size` -> PASS 3MB upload returns 400
- [ ] USER-018 Test avatar type rejects non JPG PNG file (US-010, FR-010) (docs/api.md S6) (docs/ui-flows.md S8) Errors VALIDATION_FAILED USER_AVATAR_TOO_LARGE
  Verify: Run `npm run test -- user.avatar-type` -> PASS gif upload returns 400
- [ ] USER-019 Test address invalid when geocode fails (US-008, FR-007) (docs/api.md S6) (docs/ui-flows.md S8) Errors USER_ADDRESS_INVALID
  Verify: Run `npm run test -- user.address-invalid` -> PASS bad pin returns 400
- [ ] USER-020 Test preferences invalid on unknown channel (US-009, FR-009) (docs/api.md S6) (docs/ui-flows.md S8) Errors USER_PREFERENCES_INVALID
  Verify: Run `npm run test -- user.prefs-invalid` -> PASS unknown channel returns 400
- [ ] USER-021 Test wishlist add unknown product returns 404 (US-010, FR-010) (docs/api.md S6) (docs/ui-flows.md S8) Errors PRODUCT_NOT_FOUND
  Verify: Run `npm run test -- user.wishlist-404` -> PASS bad productId returns 404
- [ ] USER-022 Test export pending polls job then download link (US-011, FR-010) (docs/api.md S6) (docs/ui-flows.md S8) Errors USER_EXPORT_PENDING
  Verify: Run `npm run test -- user.export-pending` -> PASS 202 then 200 with downloadUrl
- [ ] USER-023 Test delete idempotency second call 410 already deleted (US-011, FR-010) (docs/api.md S6) (docs/ui-flows.md S8) Errors USER_ALREADY_DELETED
  Verify: Run `npm run test -- user.delete-twice` -> PASS second DELETE returns 410
### Wave 2 UI screens

- [ ] USER-024 Build Profile screen at /profile with edit form (US-007, FR-006) (docs/api.md S6) (docs/ui-flows.md S8) Errors VALIDATION_FAILED USER_NOT_FOUND
  Verify: Run dev and open /profile -> renders and e2e edit name -> saved toast
- [ ] USER-025 Build Profile Setup onboarding screen at /profile/setup (US-007, FR-006) (docs/api.md S6) (docs/ui-flows.md S8) Errors VALIDATION_FAILED
  Verify: Run dev and open /profile/setup -> renders wizard and submit -> redirects /home
- [ ] USER-026 Build Address Book screen at /addresses with default radio (US-008, FR-008) (docs/api.md S6) (docs/ui-flows.md S8) Errors USER_ADDRESS_INVALID USER_DEFAULT_ADDRESS_REQUIRED
  Verify: Run dev and open /addresses -> renders list and set default -> exactly one checked
- [ ] USER-027 Build Wishlist screen at /wishlist with remove action (US-010, FR-010) (docs/api.md S6) (docs/ui-flows.md S8) Errors PRODUCT_NOT_FOUND UNAUTHORIZED
  Verify: Run dev and open /wishlist -> renders grid and remove -> item gone
- [ ] USER-028 Build Notification Center screen at /notifications honoring prefs (US-009, FR-009) (docs/api.md S6) (docs/ui-flows.md S8) Errors USER_PREFERENCES_INVALID UNAUTHORIZED
  Verify: Run dev and open /notifications -> renders and toggle prefs -> fan-out respected
- [ ] USER-029 Build Order History screen at /orders for customer (US-007, FR-006) (docs/api.md S6) (docs/ui-flows.md S8) Errors UNAUTHORIZED NOT_FOUND
  Verify: Run dev and open /orders -> renders list and click row -> goes to detail
- [ ] USER-030 Build Order Detail screen at /order/:id read-only (US-007, FR-006) (docs/api.md S6) (docs/ui-flows.md S8) Errors NOT_FOUND UNAUTHORIZED
  Verify: Run dev and open /order/123 -> renders timeline and receipt table
### Wave 2 close

- [ ] USER-031 Update docs/progress.md checkboxes for User US-007..US-011 complete (US-011, FR-010) (docs/api.md S6) (docs/ui-flows.md S8)
  Verify: Run `grep -n User docs/progress.md` -> shows checked boxes and `git diff --stat` -> progress.md modified
- [ ] USER-032 Verify avatar upload and address geocode use S3 and queue mocks (US-008, FR-007) (docs/api.md S6) (docs/ui-flows.md S8) Errors USER_AVATAR_TOO_LARGE USER_ADDRESS_INVALID
  Verify: Run `npm run test -- user.infra-mocks` -> PASS S3 prefix public and geocode job queued

## Wave 3 - Vendor (US-012 to US-017)

Scope: vendor register, KYC, store profile, commission, dashboard, slug check, storefront. Spec: docs/prd.md US-012..US-017, FR-011..FR-015, docs/api.md S7, docs/ui-flows.md S7 S8, docs/error-codes.md S8, docs/architecture.md S7.

| US | FR | API | UI | Tasks |
| :--- | :--- | :--- | :--- | :--- |
| US-012 register | FR-011 | S7 POST /vendors/register | S8 /vendor/onboarding | VNDR-001 VNDR-002 VNDR-018 |
| US-013 KYC docs | FR-012 | S7 POST /vendors/kyc | S8 /vendor/settings | VNDR-003 VNDR-010 VNDR-026 |
| US-014 store slug | FR-013 | S7 PUT store slug-check storefront | S8 /store/:slug | VNDR-005 VNDR-008 VNDR-009 VNDR-011 |
| US-015 stripe gate | FR-015 | S7 me dashboard | S8 /vendor/dashboard | VNDR-004 VNDR-007 VNDR-019 |
| US-016 commission | FR-014 | S7 commission | S8 /vendor/analytics | VNDR-006 VNDR-014 VNDR-025 |
| US-017 payouts view | FR-015 | S7 dashboard | S8 /vendor/payouts | VNDR-022 VNDR-023 VNDR-024 |

### Wave 3 migration

- [ ] VNDR-001 Add Prisma models Vendor VendorDocument VendorBankDetail CommissionTier and run migrate dev wave3-vendor plus prisma generate (US-012, FR-011) (docs/api.md S7) (docs/ui-flows.md S8)
  Verify: Run `npx prisma validate` -> OK and `npx prisma migrate dev --name wave3-vendor` -> Applied and `npx prisma generate` -> Generated
### Wave 3 endpoints

- [ ] VNDR-002 Implement POST /vendors/register creating Pending vendor (US-012, FR-011) (docs/api.md S7) (docs/ui-flows.md S8) Errors VALIDATION_FAILED VENDOR_NOT_APPROVED AUTH_INSUFFICIENT_ROLE
  Verify: Run `npm run test -- vendor.register` -> PASS and curl POST /api/v1/vendors/register -> 201 Pending
- [ ] VNDR-003 Implement POST /vendors/kyc multipart docs to private S3 In Review (US-013, FR-012) (docs/api.md S7) (docs/ui-flows.md S8) Errors VENDOR_NOT_APPROVED VENDOR_KYC_INCOMPLETE VALIDATION_FAILED
  Verify: Run `npm run test -- vendor.kyc` -> PASS and curl POST /api/v1/vendors/kyc -> 200 In Review
- [ ] VNDR-004 Implement GET /vendors/me returning vendor status store tier (US-015, FR-011) (docs/api.md S7) (docs/ui-flows.md S8) Errors VENDOR_NOT_FOUND UNAUTHORIZED AUTH_INSUFFICIENT_ROLE
  Verify: Run `npm run test -- vendor.me` -> PASS and curl GET /api/v1/vendors/me -> 200 status
- [ ] VNDR-005 Implement PUT /vendors/me/store updating profile auto slug unique (US-014, FR-013) (docs/api.md S7) (docs/ui-flows.md S8) Errors VENDOR_STORE_SLUG_TAKEN VENDOR_NOT_APPROVED VALIDATION_FAILED
  Verify: Run `npm run test -- vendor.store` -> PASS and curl PUT /api/v1/vendors/me/store -> 200 store
- [ ] VNDR-006 Implement GET /vendors/me/commission returning tier percent (US-016, FR-014) (docs/api.md S7) (docs/ui-flows.md S8) Errors VENDOR_COMMISSION_TIER_INVALID UNAUTHORIZED VENDOR_NOT_FOUND
  Verify: Run `npm run test -- vendor.commission` -> PASS and curl GET /api/v1/vendors/me/commission -> 200 tier
- [ ] VNDR-007 Implement GET /vendors/me/dashboard KPIs range 7d tenant isolated (US-015, FR-015) (docs/api.md S7) (docs/ui-flows.md S8) Errors VENDOR_NOT_APPROVED UNAUTHORIZED VENDOR_NOT_FOUND
  Verify: Run `npm run test -- vendor.dashboard` -> PASS and curl GET /api/v1/vendors/me/dashboard?range=7d -> 200 KPIs
- [ ] VNDR-008 Implement GET /vendors/slug-check returning available plus suggestion (US-014, FR-013) (docs/api.md S7) (docs/ui-flows.md S8) Errors VENDOR_STORE_SLUG_TAKEN VALIDATION_FAILED
  Verify: Run `npm run test -- vendor.slug-check` -> PASS and curl GET /api/v1/vendors/slug-check?slug=x -> 200 available
- [ ] VNDR-009 Implement GET /store/:slug public storefront no auth (US-014, FR-013) (docs/api.md S7) (docs/ui-flows.md S8) Errors VENDOR_NOT_FOUND NOT_FOUND
  Verify: Run `npm run test -- vendor.storefront` -> PASS and curl GET /api/v1/store/demo -> 200 store
### Wave 3 tests

- [ ] VNDR-010 Test KYC state machine Pending In Review Active Rejected (US-013, FR-012) (docs/api.md S7) (docs/ui-flows.md S8) Errors VENDOR_KYC_INCOMPLETE VENDOR_NOT_APPROVED
  Verify: Run `npm run test -- vendor.kyc-machine` -> PASS transitions enforced in order
- [ ] VNDR-011 Test slug taken returns suggestion variant (US-014, FR-013) (docs/api.md S7) (docs/ui-flows.md S8) Errors VENDOR_STORE_SLUG_TAKEN
  Verify: Run `npm run test -- vendor.slug-taken` -> PASS duplicate slug suggests name-2
- [ ] VNDR-012 Test vendor not approved gates product and payout writes (US-012, FR-011) (docs/api.md S7) (docs/ui-flows.md S7) Errors VENDOR_NOT_APPROVED
  Verify: Run `npm run test -- vendor.not-approved` -> PASS Pending vendor write returns 403
- [ ] VNDR-013 Test KYC incomplete gates dashboard store update (US-013, FR-012) (docs/api.md S7) (docs/ui-flows.md S7) Errors VENDOR_KYC_INCOMPLETE
  Verify: Run `npm run test -- vendor.kyc-gate` -> PASS no KYC returns 403 with CTA
- [ ] VNDR-014 Test commission tier invalid misconfig 500 alert (US-016, FR-014) (docs/api.md S7) (docs/ui-flows.md S8) Errors VENDOR_COMMISSION_TIER_INVALID
  Verify: Run `npm run test -- vendor.commission-bad` -> PASS bad tier returns 500
- [ ] VNDR-015 Test stripe onboarding incomplete banner gate (US-015, FR-015) (docs/api.md S7) (docs/ui-flows.md S7) Errors VENDOR_STRIPE_ONBOARDING_INCOMPLETE
  Verify: Run `npm run test -- vendor.stripe-gate` -> PASS missing stripe returns 403 banner
- [ ] VNDR-016 Test vendor RBAC 403 for customer role (US-012, FR-011) (docs/api.md S7) (docs/ui-flows.md S7) Errors AUTH_INSUFFICIENT_ROLE FORBIDDEN
  Verify: Run `npm run test -- vendor.rbac` -> PASS customer GET vendors/me returns 403
- [ ] VNDR-017 Test vendor register rate limit 429 throttles spam (US-012, FR-011) (docs/api.md S7) (docs/ui-flows.md S7) Errors RATE_LIMITED VENDOR_NOT_APPROVED
  Verify: Run `npm run test -- vendor.rate-limit` -> PASS burst returns 429
### Wave 3 UI screens

- [ ] VNDR-018 Build Vendor Onboarding Wizard at /vendor/onboarding business slug stripe (US-012, FR-011) (docs/api.md S7) (docs/ui-flows.md S8) Errors VENDOR_STORE_SLUG_TAKEN VENDOR_KYC_INCOMPLETE
  Verify: Run dev and open /vendor/onboarding -> renders wizard and submit -> Pending waiting screen
- [ ] VNDR-019 Build Vendor Dashboard at /vendor/dashboard KPI cards charts inbox (US-015, FR-015) (docs/api.md S7) (docs/ui-flows.md S8) Errors VENDOR_NOT_APPROVED VENDOR_KYC_INCOMPLETE
  Verify: Run dev and open /vendor/dashboard -> renders revenue orders rating low-stock cards
- [ ] VNDR-020 Build Vendor Product List shell at /vendor/products table (US-014, FR-013) (docs/api.md S7) (docs/ui-flows.md S8) Errors VENDOR_NOT_APPROVED
  Verify: Run dev and open /vendor/products -> renders table shell with Add Product CTA
- [ ] VNDR-021 Build Vendor Orders shell at /vendor/orders tabs New Processing Done (US-015, FR-015) (docs/api.md S7) (docs/ui-flows.md S8) Errors VENDOR_NOT_APPROVED
  Verify: Run dev and open /vendor/orders -> renders tabs and drawer skeleton
- [ ] VNDR-022 Build Payouts Overview at /vendor/payouts balance pending available (US-017, FR-015) (docs/api.md S7) (docs/ui-flows.md S8) Errors VENDOR_PAYOUT_MINIMUM VENDOR_STRIPE_ONBOARDING_INCOMPLETE
  Verify: Run dev and open /vendor/payouts -> renders balance and history list
- [ ] VNDR-023 Build Payout Detail at /vendor/payouts/:id transfer detail (US-017, FR-015) (docs/api.md S7) (docs/ui-flows.md S8) Errors VENDOR_NOT_FOUND NOT_FOUND
  Verify: Run dev and open /vendor/payouts/1 -> renders transfer id amount status
- [ ] VNDR-024 Build Vendor Reviews at /vendor/reviews list plus reply (US-017, FR-013) (docs/api.md S7) (docs/ui-flows.md S8) Errors VENDOR_NOT_APPROVED
  Verify: Run dev and open /vendor/reviews -> renders list with Reply box
- [ ] VNDR-025 Build Vendor Analytics at /vendor/analytics charts export (US-016, FR-014) (docs/api.md S7) (docs/ui-flows.md S8) Errors VENDOR_NOT_APPROVED
  Verify: Run dev and open /vendor/analytics -> renders GMV chart and Export CSV button
- [ ] VNDR-026 Build Store Settings at /vendor/settings profile KYC prefs tier card (US-013, FR-012) (docs/api.md S7) (docs/ui-flows.md S8) Errors VENDOR_KYC_INCOMPLETE VENDOR_STORE_SLUG_TAKEN
  Verify: Run dev and open /vendor/settings -> renders logo banner policies plus tier card
- [ ] VNDR-027 Build Public Storefront at /store/:slug no auth SEO (US-014, FR-013) (docs/api.md S7) (docs/ui-flows.md S8) Errors VENDOR_NOT_FOUND NOT_FOUND
  Verify: Run dev and open /store/demo -> renders hero products and policies
### Wave 3 close

- [ ] VNDR-028 Update docs/progress.md checkboxes for Vendor US-012..US-017 complete (US-017, FR-015) (docs/api.md S7) (docs/ui-flows.md S8)
  Verify: Run `grep -n Vendor docs/progress.md` -> shows checked boxes and `git diff --stat` -> progress.md modified

## Wave 4 - Product Catalog (US-018..US-025)

Scope: vendor product CRUD, variants with global SKU, categories, images WebP, inventory ledger, bulk import, AI describe, index sync. Refs: docs/prd.md US-018..US-025 + FR-016..FR-020, docs/api.md S8, docs/ui-flows.md S4 + S8, docs/architecture.md Product Module, docs/error-codes.md product codes.

Product money rule: all prices in paise integers. SKU globally unique. Images multipart max 5MB JPG/PNG/WebP, output WebP thumb/medium/large via S3/CDN.

| Method | Endpoint | Auth | Notes |
| :--- | :--- | :--- | :--- |
| GET | /products | No | list + facets + cursor |
| GET | /products/:id | No | variants + assets + rating |
| POST | /products | Vendor Active | emits ProductCreated |
| PUT | /products/:id | Vendor owner | emits ProductUpdated |
| DELETE | /products/:id | Vendor owner | logical delete, remove index |
| POST | /products/:id/images | Vendor owner | WebP pipeline |
| GET | /categories | No | tree |
| POST | /categories | Admin | create node |
| PUT | /inventory/:sku | Vendor owner | ledger delta |
| GET | /inventory/transactions | Vendor | ledger list |
| POST | /products/bulk-import | Vendor | CSV async 202 jobId |
| GET | /products/bulk-import/:jobId | Vendor | status + errorCsvUrl |
| POST | /products/:id/generate-desc | Vendor owner | AI SEO draft |
| GET | /products/:id/similar | No | embeddings + keyword fallback |

State notes:

- Product status: Draft / Published / Archived. Publish requires price + images.
- Inventory: ledger append-only, stockQty derived. Contention returns 409 PRODUCT_INVENTORY_LOCK_FAILED.
- Index sync: ProductCreated / ProductUpdated / ProductDeleted to ES + Pinecone async, lag about 1m.

```
Product flow:
POST /products -> validate SKU unique -> persist -> emit ProductCreated -> ES+Pinecone index
PUT /products/:id -> ownership check -> persist -> emit ProductUpdated -> reindex
DELETE /products/:id -> logical delete -> emit ProductDeleted -> remove from index
PUT /inventory/:sku -> ledger insert -> update stockQty -> emit InventoryDepleted if zero
```

```
Category tree:
categories(id, name, parentId, path, depth)
GET /categories returns nested tree via path prefix
POST /categories requires Admin, validates parentId
```

Env used in this wave:

```
S3_BUCKET, S3_PUBLIC_PREFIX, S3_PRIVATE_PREFIX
OPENAI_API_KEY, AI_DESCRIBE_MODEL=gpt-4o
ELASTICSEARCH_URL, PINECONE_API_KEY, PINECONE_INDEX
REDIS_URL, SEARCH_SYNC_LAG_MS
```

### Wave 4 migrations and models

- [ ] PROD-001 Create Prisma migration for products table with status enum (US-018, FR-016) (docs/api.md S8)
  Verify: Run `npx prisma migrate dev --name wave4-products` -> Applied and confirm products table exists with title, categoryId, basePrice paise, status
- [ ] PROD-002 Create Product Prisma model with vendorId tenant field and price-history relation (US-018, FR-016) (docs/api.md S8)
  Verify: Run ts-node import of model -> creates one Draft product without errors
- [ ] PROD-003 Create Prisma migration for product_variants with global unique SKU index and attributes Json (US-019, FR-017) (docs/api.md S8)
  Verify: Run `grep -q UNIQUE migration.sql` -> migration SQL contains UNIQUE(sku) and attributes JSONB column
- [ ] PROD-004 Create ProductVariant Prisma model with priceAdjustment and stockQty fields (US-019, FR-017) (docs/api.md S8)
  Verify: Run Prisma Studio flow -> creates two variants with different SKU on same product
- [ ] PROD-005 Create Prisma migration for product_assets with url thumb medium large columns (US-020, FR-019) (docs/api.md S8)
  Verify: Run migrate -> product_assets table has thumb, medium, large URL columns
- [ ] PROD-006 Create Prisma migration for categories with parentId and materialized path (US-021, FR-020) (docs/api.md S8)
  Verify: Run seed insert root + child -> path field equals rootId/childId pattern
- [ ] PROD-007 Create Prisma migration for inventory_transactions ledger with sku delta reason orderId (US-022, FR-018) (docs/api.md S8)
  Verify: Run insert delta row -> stockQty recompute query returns expected value
- [ ] PROD-008 Implement Category path helper to rebuild tree from adjacency list (US-021, FR-020) (docs/api.md S8)
  Verify: Run `npm run test -- category-tree` -> builds 3-level tree from flat rows in correct nesting order

### Wave 4 product endpoints

- [ ] PROD-009 Implement POST /products for Active vendors with Zod validation (US-018, FR-016) (docs/api.md S8)
  Verify: Run curl POST valid payload -> 201 with product id, emits ProductCreated event
- [ ] PROD-010 Implement GET /products list with category min max brand rating sort cursor filters (US-018, FR-016) (docs/api.md S8)
  Verify: Run curl GET /products?category=electronics&limit=2 -> paginated envelope with nextCursor
- [ ] PROD-011 Implement GET /products/:id with variants assets rating price-history (US-018, FR-016) (docs/api.md S8)
  Verify: Run curl GET existing id -> 200 full body, unknown id -> 404 PRODUCT_NOT_FOUND
- [ ] PROD-012 Implement PUT /products/:id with ownership check and ProductUpdated emit (US-018, FR-016) (docs/api.md S8)
  Verify: Run owner update -> 200, non-owner update -> 403 PRODUCT_UNAUTHORIZED
- [ ] PROD-013 Implement DELETE /products/:id logical delete with index-remove emit (US-018, FR-016) (docs/api.md S8)
  Verify: Run DELETE -> 200 deleted true, subsequent GET -> 404 PRODUCT_NOT_FOUND
- [ ] PROD-014 Enforce global SKU uniqueness returning 409 PRODUCT_DUPLICATE_SKU (US-019, FR-017) (docs/api.md S8)
  Verify: Run create two products with same SKU -> second returns 409 with sku in details
- [ ] PROD-015 Validate variant attributes combos returning 400 PRODUCT_INVALID_VARIANT (US-019, FR-017) (docs/api.md S8)
  Verify: Run POST invalid variant payload -> 400 PRODUCT_INVALID_VARIANT with path details
- [ ] PROD-016 Implement POST /products/:id/images multipart WebP 3-size pipeline to S3 (US-020, FR-019) (docs/api.md S8)
  Verify: Run upload JPG -> response has url thumb medium large WebP URLs
- [ ] PROD-017 Validate image type/size returning 400 PRODUCT_IMAGE_INVALID (US-020, FR-019) (docs/api.md S8)
  Verify: Run upload 6MB file -> 400 PRODUCT_IMAGE_INVALID without S3 write
- [ ] PROD-018 Implement GET /categories tree endpoint public (US-021, FR-020) (docs/api.md S8)
  Verify: Run curl GET /categories -> nested tree with parentId and children arrays
- [ ] PROD-019 Implement POST /categories Admin-only create node (US-021, FR-020) (docs/api.md S8)
  Verify: Run Admin POST with parentId -> 201, customer POST -> 403
- [ ] PROD-020 Implement PUT /inventory/:sku ledger write returning sku stockQty (US-022, FR-018) (docs/api.md S8)
  Verify: Run PUT delta -2 -> updated stockQty and ledger row with reason
- [ ] PROD-021 Implement GET /inventory/transactions vendor-scoped ledger list (US-022, FR-018) (docs/api.md S8)
  Verify: Run vendor A query -> cannot see vendor B ledger rows, returns only own SKUs
- [ ] PROD-022 Handle inventory lock contention returning 409 PRODUCT_INVENTORY_LOCK_FAILED (US-022, FR-018) (docs/api.md S8)
  Verify: Run concurrent PUT on same SKU simulation -> loser gets 409 retryable false

### Wave 4 bulk import, AI, index sync

- [ ] PROD-023 Implement POST /products/bulk-import CSV upload returning 202 jobId via BullMQ (US-023, FR-021) (docs/api.md S8)
  Verify: Run upload valid CSV -> 202 jobId, job appears in queue dashboard
- [ ] PROD-024 Implement GET /products/bulk-import/:jobId status with done and errorCsvUrl (US-023, FR-021) (docs/api.md S8)
  Verify: Run poll jobId until done true -> errorCsvUrl present when rows failed
- [ ] PROD-025 Generate bulk error CSV with row number and reason per failed row (US-023, FR-021) (docs/api.md S8)
  Verify: Run import CSV with 1 bad SKU -> error CSV contains that row plus reason
- [ ] PROD-026 Wire POST /products/:id/generate-desc to AI describe with title features input (US-024, FR-058) (docs/api.md S8)
  Verify: Run POST -> 200 description string for valid title and features list
- [ ] PROD-027 Handle AI down on generate-desc returning 503 AI_SERVICE_UNAVAILABLE (US-024, FR-058) (docs/api.md S16)
  Verify: Run with OpenAI mocked down -> 503 and UI keeps manual field editable
- [ ] PROD-028 Implement GET /products/:id/similar with embedding hits and keyword fallback (US-025, FR-022) (docs/api.md S8)
  Verify: Run with Pinecone down -> still returns 200 keyword results
- [ ] PROD-029 Emit ProductCreated ProductUpdated ProductDeleted events for ES+Pinecone sync (US-018, FR-023) (docs/api.md S8)
  Verify: Run create product -> index-sync consumer receives ProductCreated with productId

### Wave 4 tests and UI

- [ ] PROD-030 Add test for concurrent duplicate SKU returning 409 on second write (US-019, FR-017) (docs/api.md S8)
  Verify: Run `npm run test -- sku-race` -> one 201 plus one 409 PRODUCT_DUPLICATE_SKU
- [ ] PROD-031 Add test for inventory lock contention returning 409 details (US-022, FR-018) (docs/api.md S8)
  Verify: Run `npm run test -- inventory-contention` -> 409 PRODUCT_INVENTORY_LOCK_FAILED shape
- [ ] PROD-032 Build /vendor/products table with thumb title SKU price stock status rating (US-018, FR-016) (docs/ui-flows.md S8)
  Verify: Run dev and login as vendor -> table loads with cursor pagination working
- [ ] PROD-033 Build /vendor/products/new form with live preview plus Generate with AI button (US-024, FR-058) (docs/ui-flows.md S4)
  Verify: Run dev and click Generate -> streamed draft inserts into editable textarea
- [ ] PROD-034 Update docs/progress.md with Wave 4 completion status and known gaps (US-018, FR-016) (docs/api.md S8)
  Verify: Run `grep -n "Wave 4" docs/progress.md` -> rows marked done with dates

## Wave 5 - Search and Discovery (US-026..US-030)

Scope: hybrid BM25 + vector search, facets, cursor pagination, suggest, fallback chip, analytics track. Refs: docs/prd.md US-026..US-030 + FR-022..FR-025, docs/api.md S9, docs/ui-flows.md S3 + S14, docs/architecture.md Search Module.

Search combines Elasticsearch BM25 plus Pinecone cosine with configurable weights. Public endpoints, cursor pagination, facets, warning on vector fallback.

| Method | Endpoint | Auth | Notes |
| :--- | :--- | :--- | :--- |
| GET | /search | No | hybrid + facets + cursor |
| GET | /search/semantic | No | pure vector |
| GET | /search/suggest | No | min 3 chars autocomplete |
| POST | /search/index | Admin | force reindex |

```
GET /search?q=warm winter jacket&min=1000&max=8000&brand=&rating=4&cat=apparel&sort=relevance&limit=20&cursor=xxx
200: { hits[], facets, pagination, warning? }
warning SEARCH_VECTOR_FALLBACK still success true
errors: 400 SEARCH_QUERY_TOO_SHORT, 400 SEARCH_FILTER_INVALID, 503 SEARCH_INDEX_UNAVAILABLE
```

```
Hybrid merge:
1. ES keyword query + facets
2. embed query via text-embedding-3-small 1536-dim
3. Pinecone cosine topK 50
4. merge BM25 + cosine via weights from config
5. sort, paginate by cursor, attach facets
```

Env used:

```
ELASTICSEARCH_URL, ELASTICSEARCH_INDEX=products
PINECONE_API_KEY, PINECONE_INDEX, PINECONE_TOPK=50
OPENAI_API_KEY, EMBEDDING_MODEL=text-embedding-3-small
SEARCH_BM25_WEIGHT, SEARCH_VECTOR_WEIGHT
CLICKHOUSE_URL for SearchExecuted analytics
```

Facet contract:

```
facets: { brand: [{value,count}], category: [...], rating: [...], priceRanges: [...] }
sort: relevance | price_asc | price_desc | rating | newest
pagination: { nextCursor, hasMore, total? }
suggest: { suggestions: [strings], products: [mini hits] }
```

### Wave 5 index and query plumbing

- [ ] SRCH-001 Create Elasticsearch products mapping with keyword text price brand rating category fields (US-026, FR-023) (docs/api.md S9)
  Verify: Run mapping script -> index has keyword analyzer plus price as long paise
- [ ] SRCH-002 Create Pinecone products index with 1536-dim cosine metric for catalog vectors (US-027, FR-022) (docs/api.md S9)
  Verify: Run describe Pinecone index -> dimension 1536 and metric cosine
- [ ] SRCH-003 Implement product indexer consuming ProductCreated Updated Deleted with index_sync_state (US-026, FR-023) (docs/api.md S9)
  Verify: Run create product -> ES doc plus Pinecone vector appear within sync lag
- [ ] SRCH-004 Implement embedding helper via text-embedding-3-small with retry and timeout (US-027, FR-022) (docs/api.md S16)
  Verify: Run embed sample query -> 1536-length float array returned
- [ ] SRCH-005 Implement hybrid merge with configurable BM25 and cosine weights (US-028, FR-023) (docs/api.md S9)
  Verify: Run `npm run test -- hybrid-merge` -> weighted ordering matches config weights
- [ ] SRCH-006 Implement GET /search facets for brand category rating price ranges (US-029, FR-024) (docs/api.md S9)
  Verify: Run curl GET /search?q=jacket -> facets object with brand and category counts
- [ ] SRCH-007 Implement cursor pagination for search with limit 1..100 default 20 (US-030, FR-025) (docs/api.md S9)
  Verify: Run two sequential GET with nextCursor -> non-overlapping hits and hasMore flag
- [ ] SRCH-008 Implement GET /search/semantic pure vector path with embedding fallback (US-027, FR-022) (docs/api.md S9)
  Verify: Run curl GET /search/semantic?q=headphones -> hits, AI down -> keyword results
- [ ] SRCH-009 Implement GET /search/suggest with 3-char minimum and 150ms debounce guidance (US-026, FR-024) (docs/api.md S9)
  Verify: Run curl GET /search/suggest?q=hea -> suggestions plus products, q=he -> 400
- [ ] SRCH-010 Handle Pinecone down returning success true plus warning SEARCH_VECTOR_FALLBACK (US-028, FR-023) (docs/api.md S9)
  Verify: Run with Pinecone mocked down -> GET /search returns success true with warning field
- [ ] SRCH-011 Handle ES down returning 503 SEARCH_INDEX_UNAVAILABLE retryable true (US-026, FR-023) (docs/api.md S9)
  Verify: Run with ES mocked down -> GET /search returns 503 with retryable true and Retry-After
- [ ] SRCH-012 Validate query length and filters returning 400 SEARCH_QUERY_TOO_SHORT FILTER_INVALID (US-030, FR-025) (docs/api.md S9)
  Verify: Run curl GET /search?q=x -> 400 SEARCH_QUERY_TOO_SHORT with inline hint contract
- [ ] SRCH-013 Emit SearchExecuted analytics event to ClickHouse per search submit (US-030, FR-025) (docs/api.md S15)
  Verify: Run search -> events_raw row with term and filterCount appears

### Wave 5 tests and UI

- [ ] SRCH-014 Add test for vector fallback returning success true plus warning chip payload (US-028, FR-023) (docs/api.md S9)
  Verify: Run `npm run test -- vector-fallback` -> body has success true plus warning SEARCH_VECTOR_FALLBACK
- [ ] SRCH-015 Add test for short query and invalid filter error shapes (US-030, FR-025) (docs/api.md S9)
  Verify: Run `npm run test -- search-validation` -> 400 codes for too-short and bad filter cases
- [ ] SRCH-016 Add test for cursor pagination no-overlap and total handling (US-030, FR-025) (docs/api.md S9)
  Verify: Run `npm run test -- search-pagination` -> page1 and page2 ids are disjoint with limit 2
- [ ] SRCH-017 Add test for suggest minimum 3 chars and debounce contract (US-026, FR-024) (docs/api.md S9)
  Verify: Run `npm run test -- search-suggest` -> q len 2 rejected and len 3 returns suggestions
- [ ] SRCH-018 Build /search results page with facet sidebar sort bar and cursor Load more (US-029, FR-024) (docs/ui-flows.md S3)
  Verify: Run dev and search jacket -> filters update URL query plus facets refresh
- [ ] SRCH-019 Build search fallback chip Showing keyword results on warning field (US-028, FR-023) (docs/ui-flows.md S14)
  Verify: Run dev and force vector fallback -> chip appears while results remain usable
- [ ] SRCH-020 Build empty-results state with popular searches and example query (US-026, FR-024) (docs/ui-flows.md S3)
  Verify: Run dev and search nonsense term -> empty illustration plus Try warm winter jacket hint
- [ ] SRCH-021 Wire search click to POST /analytics/track search_click event (US-030, FR-025) (docs/api.md S15)
  Verify: Run dev and click result card -> track call fires before navigating to /product/:id
- [ ] SRCH-022 Update docs/progress.md with Wave 5 completion status and search weights (US-026, FR-023) (docs/api.md S9)
  Verify: Run `grep -n "Wave 5" docs/progress.md` -> rows marked done with weight values

## Wave 6 - Order Cart and Payment (US-031..US-042)

Scope: Redis cart, anon merge, checkout idempotency, saga orchestrator, cancel return reorder, Stripe intent split, webhooks, refunds, payouts. Refs: docs/prd.md US-031..US-042 + FR-026..FR-035, docs/api.md S10 + S11 + S18, docs/ui-flows.md S3 + S13 + S16, docs/architecture.md Order + Payment, docs/error-codes.md order/payment codes.

Cart in Redis TTL 15m. Checkout requires X-Idempotency-Key UUID v4. Saga: reserve inventory then payment then dispatch. Never clear cart on 402.

| Method | Endpoint | Auth | Notes |
| :--- | :--- | :--- | :--- |
| GET | /cart | Yes | Redis cart |
| POST | /cart | Yes | locks inventory 15m |
| PUT | /cart/:sku | Yes | update qty |
| DELETE | /cart/:sku | Yes | remove line |
| POST | /cart/merge | Yes | anon merge on login |
| POST | /orders/checkout | Yes | idempotency required, saga start |
| GET | /orders | Yes | own history paginated |
| GET | /orders/:id | Yes | detail scoped owner |
| POST | /orders/:id/cancel | Yes | Pending only |
| POST | /orders/:id/return | Yes | Delivered under 14d |
| POST | /orders/:id/reorder | Yes | re-add items to cart |
| POST | /payments/intent | Yes | Stripe destination split |
| POST | /payments/intent/retry | Yes | new intent same scope |
| GET | /payments/:orderId | Yes | payment status |
| POST | /payments/refund | Vendor Admin | commission adjust |
| POST | /payments/payout | Vendor | min Rs 500 |
| POST | /webhooks/stripe | No | raw body signature |

```
POST /orders/checkout
X-Idempotency-Key: uuid-v4
{ addressId, paymentMethod }
201 first key, same key returns ORIGINAL 200 ORDER_DUPLICATE_IDEMPOTENCY_KEY
errors: 400 ORDER_CART_EMPTY, 400 ORDER_CART_EXPIRED,
400 ORDER_INVENTORY_FAILED, 402 ORDER_PAYMENT_FAILED
```

```
Order states:
Pending -> Paid -> Processing -> Shipped -> Delivered -> Returned
Pending -> Cancelled
Paid -> Refunded
Guards: cancel only Pending, return only Delivered under 14d
```

```
Stripe webhook:
POST /webhooks/stripe raw buffer, Stripe-Signature verify
events: payment_intent.succeeded -> Paid, charge.refunded -> Refunded
duplicate returns 200 PAYMENT_ALREADY_PROCESSED
respond under 3s, heavy work to BullMQ
```

Env used:

```
REDIS_URL, CART_TTL_MIN=15, INVENTORY_LOCK_TTL=15m
STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, STRIPE_CONNECT_SPLIT
PLATFORM_FEE_PERCENT, VENDOR_PAYOUT_MINIMUM_PAISE=50000
```

### Wave 6 cart and checkout

- [ ] ORDR-001 Implement Redis cart schema with TTL 15m for GET /cart (US-031, FR-026) (docs/api.md S10)
  Verify: Run GET /cart on fresh user -> empty cart with TTL near 15m in Redis
- [ ] ORDR-002 Implement POST /cart add item with inventory lock 15m (US-031, FR-018) (docs/api.md S10)
  Verify: Run POST sku qty 1 -> 200 cart and Redis lock key exists for SKU
- [ ] ORDR-003 Implement PUT /cart/:sku update qty with stock clamp (US-031, FR-026) (docs/api.md S10)
  Verify: Run PUT qty above stock -> clamps to max and returns updated line total paise
- [ ] ORDR-004 Implement DELETE /cart/:sku remove line (US-031, FR-026) (docs/api.md S10)
  Verify: Run DELETE existing SKU -> 200 and line no longer appears in GET /cart
- [ ] ORDR-005 Implement POST /cart/merge for anonymous cart on login (US-032, FR-026) (docs/api.md S10)
  Verify: Run login with anon cart -> merges lines and preserves quantities without duplicates
- [ ] ORDR-006 Handle cart expired returning 400 ORDER_CART_EXPIRED with re-add CTA (US-031, FR-026) (docs/api.md S10)
  Verify: Run expire Redis key manually then checkout -> 400 ORDER_CART_EXPIRED
- [ ] ORDR-007 Implement POST /orders/checkout with X-Idempotency-Key required and IdempotencyKey persist (US-033, FR-027) (docs/api.md S10)
  Verify: Run POST without header -> 400, with UUID creates Pending order plus Stripe intent
- [ ] ORDR-008 Return ORIGINAL order on duplicate idempotency key without double charge (US-033, FR-027) (docs/api.md S10)
  Verify: Run replay same key twice -> second returns 200 ORDER_DUPLICATE_IDEMPOTENCY_KEY same orderId
- [ ] ORDR-009 Calculate checkout totals tax shipping commission in paise integers (US-033, FR-032) (docs/api.md S10)
  Verify: Run checkout math test -> subtotal plus tax plus shipping equals total paise
- [ ] ORDR-010 Handle dead SKUs returning 400 ORDER_INVENTORY_FAILED with details list (US-033, FR-018) (docs/api.md S10)
  Verify: Run checkout with out-of-stock SKU -> 400 with details array of dead SKUs

### Wave 6 saga orchestrator and order lifecycle

- [ ] ORDR-011 Implement saga orchestrator startOrderSaga Inventory then Payment then Dispatch (US-034, FR-027) (docs/api.md S10)
  Verify: Run create order -> saga_logs has reserve then intent then dispatch steps
- [ ] ORDR-012 Create saga_logs table for crash recovery with step status payload (US-034, FR-027) (docs/api.md S10)
  Verify: Run kill worker mid-saga in test -> resume reads saga_logs without duplicate charge
- [ ] ORDR-013 Implement compensating refund plus restock on payment failure path (US-034, FR-027) (docs/api.md S10)
  Verify: Run force payment fail -> inventory released plus saga marked Cancelled
- [ ] ORDR-014 Enforce order state machine guard for all transitions with order_state_transitions audit (US-035, FR-030) (docs/api.md S10)
  Verify: Run attempt Paid to Delivered skip -> 400 ORDER_INVALID_STATE_TRANSITION
- [ ] ORDR-015 Implement POST /orders/:id/cancel Pending-only with inventory release (US-036, FR-030) (docs/api.md S10)
  Verify: Run cancel Pending -> 200 Cancelled, cancel Shipped -> 400 ORDER_CANNOT_CANCEL
- [ ] ORDR-016 Implement POST /orders/:id/return Delivered under 14d window check (US-037, FR-030) (docs/api.md S10)
  Verify: Run return 10-day Delivered -> 200 ReturnRequested, 20-day -> 400 window expired
- [ ] ORDR-017 Implement POST /orders/:id/reorder re-adding lines to Redis cart (US-037, FR-026) (docs/api.md S10)
  Verify: Run reorder Delivered order -> cart lines matching original SKUs and qty
- [ ] ORDR-018 Implement GET /orders history with cursor pagination owner-scoped (US-039, FR-025) (docs/api.md S10)
  Verify: Run GET /orders?limit=2 pages -> only own orders with nextCursor chain
- [ ] ORDR-019 Implement GET /orders/:id detail with saga state and totals (US-039, FR-030) (docs/api.md S10)
  Verify: Run owner GET -> 200 detail, other user GET -> 404 ORDER_NOT_FOUND
- [ ] ORDR-020 Add test for duplicate idempotency returning original order no double charge (US-033, FR-027) (docs/api.md S10)
  Verify: Run `npm run test -- idempotency` -> Stripe mock called once for two same-key posts
- [ ] ORDR-021 Add test for declined card keeping cart intact for retry (US-040, FR-031) (docs/api.md S10)
  Verify: Run `npm run test -- declined-keeps-cart` -> GET /cart still has lines after 402 response
- [ ] ORDR-022 Build /cart page grouped by vendor with qty steppers and summary card (US-031, FR-026) (docs/ui-flows.md S3)
  Verify: Run dev and add two vendors items -> grouping plus subtotal shipping tax render
- [ ] ORDR-023 Build /checkout 3-step wizard address Stripe Elements summary with idempotency key (US-033, FR-027) (docs/ui-flows.md S13)
  Verify: Run dev and place order flow -> UUID key generated and Reserving items spinner then confirm
- [ ] ORDR-024 Build /order/:id/confirmation with receipt Track Order Continue Shopping CTAs (US-034, FR-027) (docs/ui-flows.md S13)
  Verify: Run dev and after Paid webhook -> confetti receipt plus order number copy button
- [ ] ORDR-025 Build /order/:id/track timeline with Cancel Return Reorder Invoice by state (US-035, FR-030) (docs/ui-flows.md S16)
  Verify: Run dev and Pending shows Cancel enabled, Shipped shows Cancel disabled with tooltip
- [ ] ORDR-026 Build /orders history with status filter and cursor Load more (US-039, FR-025) (docs/ui-flows.md S3)
  Verify: Run dev and filter by Delivered -> list updates plus pagination works
- [ ] ORDR-027 Build /vendor/orders tabs New Processing Completed Cancelled with saga drawer (US-041, FR-030) (docs/ui-flows.md S4)
  Verify: Run dev and vendor login -> tabs and order drawer with Mark Ready Print label actions

### Wave 6 payment intents webhooks refunds payouts

- [ ] PAYM-001 Implement POST /payments/intent with Stripe destination charges platform vendor split (US-040, FR-032) (docs/api.md S11)
  Verify: Run POST orderId -> clientSecret and Stripe mock shows transfer_data destination
- [ ] PAYM-002 Enforce paise integers for all payment amounts with Zod strict int check (US-040, FR-032) (docs/api.md S11)
  Verify: Run POST refund with decimal amount -> 400 VALIDATION_FAILED
- [ ] PAYM-003 Implement POST /webhooks/stripe with raw body and Stripe-Signature verify (US-042, FR-031) (docs/api.md S18)
  Verify: Run POST with bad signature -> 400 PAYMENT_WEBHOOK_SIGNATURE_INVALID and logs IP
- [ ] PAYM-004 Handle webhook-before-API-response via payment upsert with row lock (US-042, FR-031) (docs/api.md S18)
  Verify: Run send webhook before checkout response completes -> single Paid transition
- [ ] PAYM-005 Return 200 PAYMENT_ALREADY_PROCESSED on duplicate webhook delivery (US-042, FR-031) (docs/api.md S18)
  Verify: Run replay same Stripe event twice -> second returns 200 deduped no double Paid
- [ ] PAYM-006 Implement POST /payments/intent/retry new intent same order scope cart kept (US-040, FR-031) (docs/api.md S11)
  Verify: Run after declined, retry -> new clientSecret same orderId and cart still present
- [ ] PAYM-007 Implement POST /payments/refund full partial with commission auto-adjust (US-041, FR-033) (docs/api.md S11)
  Verify: Run partial refund -> vendor payable plus platform fee reduced proportionally in ledger
- [ ] PAYM-008 Validate refund eligibility returning 400 PAYMENT_REFUND_NOT_ELIGIBLE (US-041, FR-033) (docs/api.md S11)
  Verify: Run refund Cancelled unpaid order -> 400 with eligibility reason
- [ ] PAYM-009 Implement POST /payments/payout vendor trigger with min Rs 500 gate (US-042, FR-015) (docs/api.md S11)
  Verify: Run payout 40000 paise -> 400 VENDOR_PAYOUT_MINIMUM, 50000 succeeds
- [ ] PAYM-010 Implement GET /payments/:orderId status scoped to owner vendor admin (US-040, FR-032) (docs/api.md S11)
  Verify: Run owner GET -> intent status, stranger GET -> 404 to avoid leakage
- [ ] PAYM-011 Handle 402 PAYMENT_CARD_DECLINED staying on checkout with Try another card (US-040, FR-031) (docs/api.md S11)
  Verify: Run decline test card -> user stays on /checkout with cart kept plus Retry Payment button
- [ ] PAYM-012 Handle 3DS RequiresAction challenge completing to Succeeded via webhook (US-040, FR-031) (docs/api.md S11)
  Verify: Run 3DS test flow -> Stripe modal then webhook flips order Pending to Paid
- [ ] PAYM-013 Add test for webhook-before-response upsert race no duplicate Paid (US-042, FR-031) (docs/api.md S18)
  Verify: Run `npm run test -- webhook-race` -> parallel webhook and checkout poll confirming one Paid event
- [ ] PAYM-014 Add test for declined-keeps-cart plus retry same idempotency scope (US-040, FR-031) (docs/api.md S11)
  Verify: Run `npm run test -- declined-retry` -> cart lines persist and second intent reuses scope
- [ ] PAYM-015 Add test for refund commission adjust and payout minimum Rs 500 (US-041, FR-033) (docs/api.md S11)
  Verify: Run `npm run test -- finance-rules` -> adjusted splits and min gate error shape
- [ ] PAYM-016 Build checkout declined state with cart kept and Retry Payment CTA (US-040, FR-031) (docs/ui-flows.md S13)
  Verify: Run dev and decline in staging -> toast plus new intent button without cart clear
- [ ] PAYM-017 Build fraud-hold Under review state with support link no Cancel (US-040, FR-060) (docs/ui-flows.md S13)
  Verify: Run dev and force fraud hold -> track page shows Under review plus disabled Cancel
- [ ] PAYM-018 Build /vendor/payouts balance overview history bank settings with Rs 500 bar (US-042, FR-015) (docs/ui-flows.md S4)
  Verify: Run dev and balance below 500 -> progress bar to threshold plus minimum message
- [ ] PAYM-019 Implement Stripe webhook fast 200 under 3s deferring heavy work to BullMQ (US-042, FR-031) (docs/api.md S18)
  Verify: Run load test webhook handler p95 under 3s with queue depth metric incrementing
- [ ] PAYM-020 Rate-limit payments group 10 per min with 429 retryable plus Retry-After (US-040, FR-005) (docs/api.md S19)
  Verify: Run burst 11 intents in 60s -> 11th returns 429 with Retry-After header
- [ ] PAYM-021 Audit payment transitions to transactions ledger with idempotency_keys link (US-040, FR-027) (docs/api.md S11)
  Verify: Run query transactions after checkout refund payout -> linked keys present
- [ ] PAYM-022 Update docs/progress.md with Wave 6 completion status plus saga and payout notes (US-031, FR-027) (docs/api.md S10)
  Verify: Run `grep -n "Wave 6" docs/progress.md` -> rows marked done with saga diagram link

## Wave 7 - Delivery (US-043..US-047)

Goal: courier assignment within 5km, 60s accept window, live tracking via WS, proof of delivery, reassign, earnings. Depends on: Order saga, Vendor module, Auth sessions, PostGIS enabled Postgres. Docs: docs/prd.md US-043..US-047 + FR-036..FR-040, docs/api.md S12, docs/ui-flows.md S5, docs/error-codes.md delivery codes, docs/architecture.md Delivery models.

| US | FR | Scope | Tasks |
| :--- | :--- | :--- | :--- |
| US-043 assignment | FR-036 | 5km PostGIS match | DLVR-001 DLVR-002 DLVR-004 DLVR-015 |
| US-044 accept window | FR-037 | 60s accept + WS room | DLVR-005 DLVR-006 DLVR-007 DLVR-012 DLVR-016 |
| US-045 tracking + proof | FR-038 | WS broadcast + photo required | DLVR-008 DLVR-009 DLVR-013 |
| US-046 reassign | FR-039 | rebroadcast flow | DLVR-010 DLVR-017 |
| US-047 earnings | FR-040 | trips + payouts | DLVR-011 DLVR-014 DLVR-017 |

### Wave 7 migrations and models

- [ ] DLVR-001 Create Prisma Delivery model with status courierId orderId (US-043, FR-036) (docs/api.md S12)
  Verify: Run `npx prisma validate` -> passes and Delivery table appears in migration SQL
- [ ] DLVR-002 Enable PostGIS extension and add geography point column for courier location (US-043, FR-036) (docs/api.md S12)
  Verify: Run migration apply -> ST_DWithin query runs in psql without errors
- [ ] DLVR-003 Create DeliveryStatusHistory model for audit trail (US-045, FR-038) (docs/api.md S12)
  Verify: Run Prisma Studio -> relation Delivery to DeliveryStatusHistory visible

### Wave 7 API endpoints

- [ ] DLVR-004 Implement POST /delivery/assign with 5km ST_DWithin filter (US-043, FR-036) (docs/api.md S12)
  Verify: Run curl assign -> 201 for courier in 5km and 404 no-courier out of range
- [ ] DLVR-005 Implement POST /delivery/:id/accept with 60s expiry check (US-044, FR-037) (docs/api.md S12)
  Verify: Run accept after 60s -> 410 Gone delivery_expired
- [ ] DLVR-006 Implement WS room order:<id> join with auth guard (US-044, FR-037) (docs/api.md S12)
  Verify: Run authenticated client join order:123 -> receives joined ack
- [ ] DLVR-007 Implement WS emit delivery.status.updated to room order:<id> (US-045, FR-038) (docs/api.md S12)
  Verify: Run PATCH status -> WS event in room within 1s
- [ ] DLVR-008 Implement PATCH /delivery/:id/status with state machine Queued Offered Accepted PickedUp InTransit Arrived Delivered (US-045, FR-038) (docs/api.md S12)
  Verify: Run invalid transition -> 422 invalid_status_transition
- [ ] DLVR-009 Implement POST /delivery/:id/proof with photo upload required (US-045, FR-038) (docs/api.md S12)
  Verify: Run complete without proof -> 422 proof_required
- [ ] DLVR-010 Implement POST /delivery/:id/reassign to new courier (US-046, FR-039) (docs/api.md S12)
  Verify: Run reassign -> new assignment created and old courier notified
- [ ] DLVR-011 Implement GET /delivery/earnings with date filter totals plus per-order breakdown (US-047, FR-040) (docs/api.md S12)
  Verify: Run curl GET /delivery/earnings -> total plus per-order breakdown matching fixtures

### Wave 7 UI screens

- [ ] DLVR-012 Build courier accept card with 60s countdown timer at /delivery/jobs (US-044, FR-037) (docs/api.md S12)
  Verify: Run dev and timer hits 0 -> Accept button disables in browser test
- [ ] DLVR-013 Build proof capture screen with photo upload at /delivery/active/:id (US-045, FR-038) (docs/api.md S12)
  Verify: Run dev and submit blocked until photo attached per docs/ui-flows.md S5
- [ ] DLVR-014 Build earnings screen with totals table at /delivery/earnings (US-047, FR-040) (docs/api.md S12)
  Verify: Run dev and screen renders totals from GET earnings fixture

### Wave 7 tests and close

- [ ] DLVR-015 Add unit test for 5km geo query boundary (US-043, FR-036) (docs/api.md S12)
  Verify: Run `npm run test -- delivery.geo` -> 4.9km in and 5.1km out pass
- [ ] DLVR-016 Add integration test for 60s accept expiry (US-044, FR-037) (docs/api.md S12)
  Verify: Run `npm run test -- delivery.accept` -> expired and valid cases pass
- [ ] DLVR-017 Add e2e test for reassign plus earnings recalc (US-046, FR-039) (docs/api.md S12)
  Verify: Run playwright reassign flow -> earnings total updates
- [ ] DLVR-018 Update docs/progress.md checkboxes for Delivery US-043..US-047 complete (US-047, FR-040) (docs/api.md S12)
  Verify: Run `grep -n Delivery docs/progress.md` -> shows checked boxes modified

Exit: 5km filter enforced, 60s window enforced, WS room live, proof required, reassign works.

## Wave 8 - Notification (US-048..US-051)

Goal: fan-out by topic, handlebars templates, retry x3, FCM tokens, bell + prefs UI. Depends on: Auth users, Delivery and Order events. Docs: docs/prd.md US-048..US-051 + FR-041..FR-044, docs/api.md S13, docs/ui-flows.md S5, docs/error-codes.md notification codes, docs/architecture.md Notification models.

| US | FR | Scope | Tasks |
| :--- | :--- | :--- | :--- |
| US-048 fan-out | FR-041 | topic fan-out | NTFY-001 NTFY-002 NTFY-012 NTFY-013 |
| US-049 templates | FR-042 | handlebars + retry x3 | NTFY-003 NTFY-004 NTFY-014 |
| US-050 push | FR-043 | FCM tokens + push | NTFY-005 NTFY-006 |
| US-051 center | FR-044 | bell + prefs UI | NTFY-007 NTFY-008 NTFY-009 NTFY-010 NTFY-011 |

### Wave 8 models and services

- [ ] NTFY-001 Create Prisma Notification + NotificationTemplate + DeviceToken models (US-048, FR-041) (docs/api.md S13)
  Verify: Run `npx prisma migrate dev --name wave8-notify` -> applied and models appear in ERD
- [ ] NTFY-002 Implement topic fan-out service for order/user/vendor topics (US-048, FR-041) (docs/api.md S13)
  Verify: Run one publish -> N rows for N subscribers in test DB
- [ ] NTFY-003 Implement handlebars template render service with layout (US-049, FR-042) (docs/api.md S13)
  Verify: Run render order_shipped template with fixture -> expected subject line
- [ ] NTFY-004 Implement retry x3 with exponential backoff worker (US-049, FR-042) (docs/api.md S13)
  Verify: Run failed send -> retries 3 times then marks dead_letter

### Wave 8 endpoints and UI

- [ ] NTFY-005 Implement POST /notifications/tokens for FCM registration (US-050, FR-043) (docs/api.md S13)
  Verify: Run curl duplicate token -> upserts and returns 201
- [ ] NTFY-006 Implement FCM push provider sender (US-050, FR-043) (docs/api.md S13)
  Verify: Run mocked FCM -> receives payload with title and data.orderId
- [ ] NTFY-007 Implement GET /notifications with pagination plus unread_count (US-051, FR-044) (docs/api.md S13)
  Verify: Run curl GET /notifications -> unread_count plus paged list
- [ ] NTFY-008 Implement PATCH /notifications/:id/read endpoint (US-051, FR-044) (docs/api.md S13)
  Verify: Run mark read -> decrements unread_count
- [ ] NTFY-009 Build bell icon component with unread badge (US-051, FR-044) (docs/api.md S13)
  Verify: Run dev and badge shows count from GET fixture per docs/ui-flows.md S5
- [ ] NTFY-010 Build notification prefs screen with topic toggles (US-051, FR-044) (docs/api.md S13)
  Verify: Run dev and toggles persist after reload in manual test
- [ ] NTFY-011 Implement PUT /notifications/prefs endpoint for opt-out (US-051, FR-044) (docs/api.md S13)
  Verify: Run opt-out topic -> skips fan-out in service test
- [ ] NTFY-012 Implement webhook handler delivery.status.updated to trigger notify (US-048, FR-041) (docs/api.md S13)
  Verify: Run webhook POST -> creates notification per docs/api.md webhooks

### Wave 8 tests and close

- [ ] NTFY-013 Add unit test for fan-out routing (US-048, FR-041) (docs/api.md S13)
  Verify: Run `npm run test -- notify.fanout` -> passes
- [ ] NTFY-014 Add integration test for retry x3 then DLQ (US-049, FR-042) (docs/api.md S13)
  Verify: Run `npm run test -- notify.retry` -> shows 3 attempts in logs
- [ ] NTFY-015 Update docs/progress.md checkboxes for Notification US-048..US-051 complete (US-051, FR-044) (docs/api.md S13)
  Verify: Run `grep -n Notification docs/progress.md` -> shows checked boxes modified

Exit: fan-out correct, templates render, retry x3 logged, push delivered, bell updates.

## Wave 9 - Review (US-052..US-055)

Goal: verified-buyer gate, sync AI moderation 0.8 threshold, avg recalc, helpful vote, vendor reply threading, moderation queue. Depends on: Orders, Products, AI moderation service. Docs: docs/prd.md US-052..US-055 + FR-046..FR-050, docs/api.md S14, docs/ui-flows.md S6, docs/error-codes.md review codes, docs/architecture.md Review models.

| US | FR | Scope | Tasks |
| :--- | :--- | :--- | :--- |
| US-052 create | FR-046 | verified buyer gate | RVW-001 RVW-002 RVW-009 RVW-010 RVW-012 |
| US-053 moderation | FR-047 FR-048 | AI 0.8 + avg recalc | RVW-003 RVW-004 RVW-013 RVW-014 |
| US-054 vote + reply | FR-049 | helpful + threading | RVW-005 RVW-006 RVW-015 |
| US-055 queue | FR-050 | moderation queue | RVW-007 RVW-008 RVW-011 |

### Wave 9 models and endpoints

- [ ] RVW-001 Create Prisma Review model with parent_review_id self-relation (US-054, FR-049) (docs/api.md S14)
  Verify: Run `npx prisma migrate dev --name wave9-review` -> applied and self FK exists
- [ ] RVW-002 Implement POST /products/:id/reviews with verified-buyer gate (US-052, FR-046) (docs/api.md S14)
  Verify: Run non-buyer POST -> 403 not_verified_buyer
- [ ] RVW-003 Implement sync AI moderation check with 0.8 block threshold (US-053, FR-047) (docs/api.md S14)
  Verify: Run score 0.85 -> blocked, 0.5 -> allowed in unit stub
- [ ] RVW-004 Implement product avg rating recalc on approve/create (US-053, FR-048) (docs/api.md S14)
  Verify: Run two reviews 4 and 5 -> avg 4.5 in DB
- [ ] RVW-005 Implement POST /reviews/:id/helpful vote endpoint (US-054, FR-049) (docs/api.md S14)
  Verify: Run duplicate vote from same user -> 409
- [ ] RVW-006 Implement POST /reviews/:id/reply with parent_review_id for vendor (US-054, FR-049) (docs/api.md S14)
  Verify: Run reply row -> stores parent_review_id correctly
- [ ] RVW-007 Implement GET /admin/reviews/queue for moderation (US-055, FR-050) (docs/api.md S14)
  Verify: Run curl -> returns only pending flag=true items
- [ ] RVW-008 Implement PATCH /admin/reviews/:id/moderate approve-reject (US-055, FR-050) (docs/api.md S14)
  Verify: Run reject -> hides review from public list
- [ ] RVW-009 Implement GET /products/:id/reviews public list (US-052, FR-046) (docs/api.md S14)
  Verify: Run curl -> blocked and rejected reviews excluded

### Wave 9 UI and tests

- [ ] RVW-010 Build review form screen with star input (US-052, FR-046) (docs/api.md S14)
  Verify: Run dev and form posts fixture -> shows success per docs/ui-flows.md S6
- [ ] RVW-011 Build moderation queue screen with approve-reject buttons (US-055, FR-050) (docs/api.md S14)
  Verify: Run dev and approve -> removes row from queue in UI test
- [ ] RVW-012 Add unit test for verified-buyer gate (US-052, FR-046) (docs/api.md S14)
  Verify: Run `npm run test -- review.gate` -> passes
- [ ] RVW-013 Add unit test for 0.8 moderation threshold edge (US-053, FR-047) (docs/api.md S14)
  Verify: Run `npm run test -- review.moderation` -> covers 0.79 vs 0.80
- [ ] RVW-014 Add integration test for avg recalc (US-053, FR-048) (docs/api.md S14)
  Verify: Run `npm run test -- review.avg` -> asserts DB avg after insert
- [ ] RVW-015 Add integration test for vendor reply threading (US-054, FR-049) (docs/api.md S14)
  Verify: Run `npm run test -- review.thread` -> reply fetch includes parent body
- [ ] RVW-016 Update docs/progress.md checkboxes for Review US-052..US-055 complete (US-055, FR-050) (docs/api.md S14)
  Verify: Run `grep -n Review docs/progress.md` -> shows checked boxes modified

Exit: only buyers review, moderation blocks at 0.8, avg correct, queue drains.

## Wave 10 - Analytics (US-056..US-059)

Goal: event ingest pipeline, materialized views, 5m cache, tenant isolation, async CSV export, NL-to-SQL. Depends on: Orders, Products, tenant context. Docs: docs/prd.md US-056..US-059 + FR-051..FR-055, docs/api.md S15, docs/ui-flows.md S20, docs/error-codes.md analytics codes, docs/architecture.md Analytics models.

| US | FR | Scope | Tasks |
| :--- | :--- | :--- | :--- |
| US-056 ingest | FR-051 | event pipeline | ANLY-001 ANLY-002 ANLY-003 ANLY-004 |
| US-057 dashboard | FR-052 FR-053 | cache + isolation | ANLY-005 ANLY-006 ANLY-010 ANLY-012 ANLY-013 |
| US-058 export | FR-054 | async CSV | ANLY-007 ANLY-008 ANLY-011 |
| US-059 NL query | FR-055 | NL-to-SQL | ANLY-009 |

### Wave 10 pipeline and endpoints

- [ ] ANLY-001 Create Prisma AnalyticsEvent model with tenantId index (US-056, FR-051) (docs/api.md S15)
  Verify: Run `npx prisma migrate dev --name wave10-analytics` -> applied and tenantId index exists
- [ ] ANLY-002 Implement event producer for order-viewed and checkout events (US-056, FR-051) (docs/api.md S15)
  Verify: Run test producer -> emits to local topic in integration log
- [ ] ANLY-003 Implement ClickHouse ingest consumer batch writer (US-056, FR-051) (docs/api.md S15)
  Verify: Run 100 test events -> appear in ClickHouse table
- [ ] ANLY-004 Create ClickHouse materialized view for daily sales per vendor (US-056, FR-051) (docs/api.md S15)
  Verify: Run SELECT from view -> aggregated totals returned
- [ ] ANLY-005 Implement GET /analytics/dashboard with 5m Redis cache (US-057, FR-052) (docs/api.md S15)
  Verify: Run second call -> hits cache header X-Cache: HIT
- [ ] ANLY-006 Enforce tenant isolation on all analytics queries (US-057, FR-053) (docs/api.md S15)
  Verify: Run vendor A query -> cannot see vendor B rows in test
- [ ] ANLY-007 Implement POST /analytics/exports async CSV job enqueue (US-058, FR-054) (docs/api.md S15)
  Verify: Run curl -> returns 202 with jobId
- [ ] ANLY-008 Implement GET /analytics/exports/:jobId/download endpoint (US-058, FR-054) (docs/api.md S15)
  Verify: Run completed job -> downloads CSV with header row
- [ ] ANLY-009 Implement POST /analytics/nl-query NL-to-SQL endpoint (US-059, FR-055) (docs/api.md S15)
  Verify: Run prompt top products -> returns SQL with LIMIT

### Wave 10 UI and tests

- [ ] ANLY-010 Build analytics dashboard screen with charts (US-057, FR-052) (docs/api.md S15)
  Verify: Run dev and screen renders fixture KPIs per docs/ui-flows.md S20
- [ ] ANLY-011 Build export button with job polling UI (US-058, FR-054) (docs/api.md S15)
  Verify: Run dev and button polls until ready then shows download link
- [ ] ANLY-012 Add unit test for tenant isolation filter (US-057, FR-053) (docs/api.md S15)
  Verify: Run `npm run test -- analytics.tenant` -> passes
- [ ] ANLY-013 Add integration test for 5m cache expiry (US-057, FR-052) (docs/api.md S15)
  Verify: Run `npm run test -- analytics.cache` -> asserts HIT then MISS after TTL mock
- [ ] ANLY-014 Update docs/progress.md checkboxes for Analytics US-056..US-059 complete (US-059, FR-055) (docs/api.md S15)
  Verify: Run `grep -n Analytics docs/progress.md` -> shows checked boxes modified

Exit: events flow to ClickHouse, dashboard cached 5m, exports async, tenant safe.

## Wave 11 - AI (US-060..US-065)

Goal: RAG chat stream with cart injection and quota, embeddings pipeline, pricing cron, fraud 0-100 with hold, recommendations. Depends on: Catalog, Cart, Orders. Docs: docs/prd.md US-060..US-065 + FR-056..FR-060, docs/api.md S16, docs/ui-flows.md S21, docs/error-codes.md AI codes, docs/architecture.md AI models.

| US | FR | Scope | Tasks |
| :--- | :--- | :--- | :--- |
| US-060 chat | FR-056 | RAG stream | AI-001 AI-002 AI-011 AI-013 |
| US-061 embeddings | FR-057 FR-022 | pipeline | AI-005 AI-006 |
| US-062 pricing | FR-058 | nightly cron | AI-007 AI-017 |
| US-063 fraud | FR-059 FR-060 | scorer + hold | AI-008 AI-009 AI-015 |
| US-064 recs | FR-057 | recommendations | AI-010 AI-016 |
| US-065 quota | FR-057 | quota + injection | AI-003 AI-004 AI-012 AI-014 |

### Wave 11 models and endpoints

- [ ] AI-001 Create Prisma AiConversation + AiMessage + AiQuota models (US-060, FR-056) (docs/api.md S16)
  Verify: Run `npx prisma migrate dev --name wave11-ai` -> applied and relations validate
- [ ] AI-002 Implement POST /ai/chat stream SSE with RAG context (US-060, FR-056) (docs/api.md S16)
  Verify: Run curl -> streams tokens with data: chunks
- [ ] AI-003 Implement cart injection tool that adds SKU from chat (US-065, FR-057) (docs/api.md S16)
  Verify: Run chat action add_to_cart -> creates cart line in test
- [ ] AI-004 Implement per-user daily quota middleware for AI endpoints (US-065, FR-057) (docs/api.md S16)
  Verify: Run over-quota -> returns 429 ai_quota_exceeded
- [ ] AI-005 Implement embeddings pipeline worker for product catalog (US-061, FR-057) (docs/api.md S16)
  Verify: Run product save -> enqueues embedding job in queue log
- [ ] AI-006 Add vector column index for embedding similarity search (US-061, FR-022) (docs/api.md S16)
  Verify: Run cosine similarity query -> ranked fixture returned
- [ ] AI-007 Implement pricing cron that suggests price deltas nightly (US-062, FR-058) (docs/api.md S16)
  Verify: Run cron run -> writes suggestion rows in test DB
- [ ] AI-008 Implement fraud scorer service 0-100 on checkout (US-063, FR-059) (docs/api.md S16)
  Verify: Run risky fixture -> scores above 80 in unit test
- [ ] AI-009 Implement fraud hold action blocking payout on high score (US-063, FR-060) (docs/api.md S16)
  Verify: Run score 90 -> sets order hold with reason
- [ ] AI-010 Implement GET /ai/recommendations per user (US-064, FR-057) (docs/api.md S16)
  Verify: Run curl -> returns 10 items from embedding similarity

### Wave 11 UI and tests

- [ ] AI-011 Build AI chat drawer UI with stream rendering (US-060, FR-056) (docs/api.md S16)
  Verify: Run dev and drawer streams tokens per docs/ui-flows.md S21
- [ ] AI-012 Build quota-exceeded empty state UI (US-065, FR-057) (docs/api.md S16)
  Verify: Run dev and 429 -> shows upgrade prompt in UI test
- [ ] AI-013 Add unit test for RAG stream tool calling (US-060, FR-056) (docs/api.md S16)
  Verify: Run `npm run test -- ai.chat` -> passes
- [ ] AI-014 Add unit test for per-user quota counting (US-065, FR-057) (docs/api.md S16)
  Verify: Run `npm run test -- ai.quota` -> blocks after N calls
- [ ] AI-015 Add unit test for fraud scorer thresholds (US-063, FR-059) (docs/api.md S16)
  Verify: Run `npm run test -- ai.fraud` -> covers 0, 50, 100 bands
- [ ] AI-016 Add integration test for recommendations relevance (US-064, FR-057) (docs/api.md S16)
  Verify: Run `npm run test -- ai.recs` -> asserts category match
- [ ] AI-017 Add integration test for pricing cron idempotency (US-062, FR-058) (docs/api.md S16)
  Verify: Run double run -> does not duplicate suggestions
- [ ] AI-018 Update docs/progress.md checkboxes for AI US-060..US-065 complete (US-065, FR-060) (docs/api.md S16)
  Verify: Run `grep -n "AI Module" docs/progress.md` -> shows checked boxes modified

Exit: chat streams, quota enforced, fraud holds, recs relevant, pricing runs.

## Wave 12 - Admin (US-066..US-070)

Goal: approve-reject vendors, ban with session revoke, superadmin impersonation audited, flags pub-sub, config validation, immutable audit, health dashboard. Depends on: Auth RBAC, Vendor onboarding, audit store. Docs: docs/prd.md US-066..US-070 + FR-061..FR-065, docs/api.md S17, docs/ui-flows.md S6 + S16, docs/error-codes.md admin codes, docs/architecture.md Admin models.

| US | FR | Scope | Tasks |
| :--- | :--- | :--- | :--- |
| US-066 approval | FR-061 | vendor approve | ADMN-001 ADMN-002 ADMN-003 ADMN-012 |
| US-067 ban | FR-062 | ban + revoke | ADMN-004 ADMN-015 |
| US-068 impersonate | FR-063 FR-064 | audited | ADMN-005 ADMN-006 ADMN-014 ADMN-016 |
| US-069 flags/config | FR-064 | pub-sub + validation | ADMN-007 ADMN-008 ADMN-009 ADMN-010 |
| US-070 health/audit | FR-065 | dashboard + log | ADMN-011 ADMN-013 |

### Wave 12 models and endpoints

- [ ] ADMN-001 Create Prisma AuditLog append-only model with actor + action (US-068, FR-063) (docs/api.md S17)
  Verify: Run `npx prisma migrate dev --name wave12-admin` -> applied and update trigger blocked in test
- [ ] ADMN-002 Implement POST /admin/vendors/:id/approve endpoint (US-066, FR-061) (docs/api.md S17)
  Verify: Run pending vendor approve -> becomes active and audit row written
- [ ] ADMN-003 Implement POST /admin/vendors/:id/reject with reason required (US-066, FR-061) (docs/api.md S17)
  Verify: Run reject without reason -> returns 422
- [ ] ADMN-004 Implement POST /admin/users/:id/ban with session revoke (US-067, FR-062) (docs/api.md S17)
  Verify: Run banned user login -> sessions deleted and login returns 403
- [ ] ADMN-005 Implement POST /admin/impersonate superadmin only with audit (US-068, FR-063) (docs/api.md S17)
  Verify: Run non-superadmin -> 403 and success writes audit row
- [ ] ADMN-006 Implement immutable audit writer service no-update-no-delete (US-068, FR-064) (docs/api.md S17)
  Verify: Run UPDATE on audit log -> raises error in test
- [ ] ADMN-007 Implement GET /admin/flags endpoint (US-069, FR-064) (docs/api.md S17)
  Verify: Run curl -> returns flag list with enabled booleans
- [ ] ADMN-008 Implement PUT /admin/flags/:key with pub-sub publish (US-069, FR-064) (docs/api.md S17)
  Verify: Run flag change -> emits event received by subscriber test
- [ ] ADMN-009 Implement config validation service for schema check (US-069, FR-064) (docs/api.md S17)
  Verify: Run invalid config -> returns 422 config_invalid
- [ ] ADMN-010 Implement PUT /admin/config endpoint (US-069, FR-064) (docs/api.md S17)
  Verify: Run valid config -> persists and invalid rejected
- [ ] ADMN-011 Implement GET /admin/health dashboard metrics (US-070, FR-065) (docs/api.md S17)
  Verify: Run curl -> returns uptime + queue depth + error rate

### Wave 12 UI and tests

- [ ] ADMN-012 Build admin approval queue screen at /admin/vendors (US-066, FR-061) (docs/api.md S17)
  Verify: Run dev and approve button calls API per docs/ui-flows.md S6
- [ ] ADMN-013 Build health dashboard screen with status cards at /admin/health (US-070, FR-065) (docs/api.md S17)
  Verify: Run dev and cards render fixture metrics per docs/ui-flows.md S16
- [ ] ADMN-014 Build impersonation banner UI with exit button (US-068, FR-063) (docs/api.md S17)
  Verify: Run dev and banner visible during impersonation session
- [ ] ADMN-015 Add integration test for ban plus session revoke (US-067, FR-062) (docs/api.md S17)
  Verify: Run `npm run test -- admin.ban` -> passes
- [ ] ADMN-016 Add integration test for impersonation audit trail (US-068, FR-063) (docs/api.md S17)
  Verify: Run `npm run test -- admin.impersonate` -> finds audit row
- [ ] ADMN-017 Update docs/progress.md checkboxes for Admin US-066..US-070 complete (US-070, FR-065) (docs/api.md S17)
  Verify: Run `grep -n Admin docs/progress.md` -> shows checked boxes modified

Exit: approvals work, bans revoke, impersonation audited, audit immutable, health visible.

## MVP Launch Gate - P0 Verification

Goal: verify all P0 stories live, seed data ready, uptime met, progress closed per PRD Section 15 timeline. Gate list P0: US-001, US-002, US-004, US-005, US-006, US-009, US-012, US-013, US-018, US-019, US-022, US-026, US-028, US-031, US-032, US-033, US-038, US-040, US-043, US-048, US-052, US-060, US-066. Rule: one verify task per P0 plus uptime, seed, final update. No new features in gate.

| Task range | Covers | Check |
| :--- | :--- | :--- |
| MVP-001..MVP-023 | P0 stories live smoke | staging pass |
| MVP-024 | uptime | SLO |
| MVP-025 | seed | data |
| MVP-026 | close | docs |

### MVP gate tasks

- [ ] MVP-001 Verify US-001 register live smoke on staging (US-001, FR-001) (docs/api.md S5)
  Verify: Run signup plus login -> succeeds on staging
- [ ] MVP-002 Verify US-002 login live smoke on staging (US-002, FR-001) (docs/api.md S5)
  Verify: Run login with seeded user -> 200 on staging
- [ ] MVP-003 Verify US-004 forgot-password live smoke on staging (US-004, FR-004) (docs/api.md S5)
  Verify: Run reset request -> If account exists message on staging
- [ ] MVP-004 Verify US-005 refresh live smoke on staging (US-005, FR-003) (docs/api.md S5)
  Verify: Run refresh with valid token -> rotated pair on staging
- [ ] MVP-005 Verify US-006 RBAC live smoke on staging (US-006, FR-005) (docs/api.md S5)
  Verify: Run customer hitting vendor route -> 403 on staging
- [ ] MVP-006 Verify US-009 addresses live smoke on staging (US-009, FR-008) (docs/api.md S6)
  Verify: Run add address -> default set on staging
- [ ] MVP-007 Verify US-012 vendor register live smoke on staging (US-012, FR-011) (docs/api.md S7)
  Verify: Run vendor apply -> Pending on staging
- [ ] MVP-008 Verify US-013 KYC live smoke on staging (US-013, FR-012) (docs/api.md S7)
  Verify: Run KYC upload -> In Review on staging
- [ ] MVP-009 Verify US-018 product create live smoke on staging (US-018, FR-016) (docs/api.md S8)
  Verify: Run vendor product create -> 201 on staging
- [ ] MVP-010 Verify US-019 variants live smoke on staging (US-019, FR-017) (docs/api.md S8)
  Verify: Run variant SKUs unique -> listed on staging
- [ ] MVP-011 Verify US-022 inventory live smoke on staging (US-022, FR-018) (docs/api.md S8)
  Verify: Run stock decrement matches order qty on staging
- [ ] MVP-012 Verify US-026 search live smoke on staging (US-026, FR-023) (docs/api.md S9)
  Verify: Run keyword search -> relevant SKU on staging
- [ ] MVP-013 Verify US-028 checkout totals live smoke on staging (US-028, FR-024) (docs/api.md S10)
  Verify: Run cart to order -> completes without error on staging
- [ ] MVP-014 Verify US-031 cart live smoke on staging (US-031, FR-026) (docs/api.md S10)
  Verify: Run add to cart -> line present on staging
- [ ] MVP-015 Verify US-032 checkout live smoke on staging (US-032, FR-027) (docs/api.md S10)
  Verify: Run place order -> Pending on staging
- [ ] MVP-016 Verify US-033 order tracking live smoke on staging (US-033, FR-030) (docs/api.md S10)
  Verify: Run order status page -> shows current state on staging
- [ ] MVP-017 Verify US-038 payment live smoke on staging (US-038, FR-032) (docs/api.md S11)
  Verify: Run test card payment -> captured in dashboard on staging
- [ ] MVP-018 Verify US-040 payout live smoke on staging (US-040, FR-015) (docs/api.md S11)
  Verify: Run vendor payout above Rs 500 -> transfer on staging
- [ ] MVP-019 Verify US-043 delivery assign live smoke on staging (US-043, FR-036) (docs/api.md S12)
  Verify: Run assign within 5km -> succeeds on staging
- [ ] MVP-020 Verify US-048 notification fan-out live smoke on staging (US-048, FR-041) (docs/api.md S13)
  Verify: Run order event -> bell notification created on staging
- [ ] MVP-021 Verify US-052 review create live smoke on staging (US-052, FR-046) (docs/api.md S14)
  Verify: Run verified buyer post -> review published on staging
- [ ] MVP-022 Verify US-060 AI chat live smoke on staging (US-060, FR-056) (docs/api.md S16)
  Verify: Run chat streams answer with quota check on staging
- [ ] MVP-023 Verify US-066 vendor approve live smoke on staging (US-066, FR-061) (docs/api.md S17)
  Verify: Run admin approve -> vendor active on staging
- [ ] MVP-024 Verify 99.9 percent uptime SLO last 7 days (PRD Section 6) (docs/api.md S17)
  Verify: Run open monitoring dashboard -> shows no breach
- [ ] MVP-025 Verify production seed data and flags loaded (PRD Section 15) (docs/api.md S17)
  Verify: Run seed script -> idempotent and config valid
- [ ] MVP-026 Update launch progress and close gate checklist (PRD Section 15) (docs/api.md S17)
  Verify: Run `grep -n "M9" docs/progress.md` -> marks all P0 done per timeline

Gate exit: all P0 smoke pass, uptime met, seed done, checklist closed.

## Wave Dependencies and Ordering

Waves run top-to-bottom. A wave starts only when its `Depends on` waves are Done (100% boxes checked + CI green). No skipping: Order needs Product SKUs, Payment needs Order intents, Delivery needs Paid orders.

| Wave | Depends on | Provides to later waves | Can parallelize with |
| :--- | :--- | :--- | :--- |
| Phase 0-1 | nothing | baseline, decisions | nothing (do first) |
| Phase 2-3 | Phase 0-1 | runnable app + infra | Phase 4 (env file) |
| Phase 4-5 | Phase 2-3 | config + CI green | nothing (gate) |
| Wave 1 Auth | Phase 5 | JWT, sessions, RBAC | Wave 2 UI mocks only |
| Wave 2 User | Wave 1 | profiles, addresses | Wave 3 models |
| Wave 3 Vendor | Wave 1-2 | vendor Active gate | Wave 4 models |
| Wave 4 Product | Wave 3 | SKUs, inventory, index events | Wave 5 infra setup |
| Wave 5 Search | Wave 4 | hybrid search | Wave 6 cart tasks |
| Wave 6 Order+Pay | Wave 4-5 | Paid orders, webhooks | nothing (critical path) |
| Wave 7 Delivery | Wave 6 | Delivered status | Wave 8 |
| Wave 8 Notify | Wave 6-7 | fan-out, bell | Wave 9 |
| Wave 9 Review | Wave 6 | ratings, queue | Wave 10 |
| Wave 10 Analytics | Wave 6 | dashboards, exports | Wave 11 |
| Wave 11 AI | Wave 4-6 | chat, fraud, recs | Wave 12 |
| Wave 12 Admin | Wave 1-3 | approvals, audit | Wave 10-11 |
| MVP Gate | all waves | launch | nothing |

Critical path (longest chain, prioritize when blocked):

```
Phase 0-1 -> Phase 2-3 -> Phase 4-5 -> Wave 1 -> Wave 3 -> Wave 4 -> Wave 6 -> MVP Gate
```

If stuck on a wave, allowed overlap (with note in PR body):

- UI screens of wave N may start when wave N endpoints are In Progress (mock API per docs/api.md).
- Test tasks of wave N may start alongside endpoint tasks (TDD encouraged).
- Never start wave N+1 migration before wave N migration is merged.

## Milestone to Task Map

Maps docs/progress.md milestones M0-M9 to exact task ranges in this file. Mark a milestone Done only when every range hits 100%.

| Milestone | Task ranges | Count |
| :--- | :--- | :---: |
| M0 docs + baseline | P0-001..P0-028 (docs baseline subset) | 28 |
| M1 machine ready | P1-001..P1-024 + P2 + P3 + P4 + P5 | 185 |
| M2 Auth + User | AUTH-001..AUTH-030 + USER-001..USER-032 | 62 |
| M3 Vendor + Product | VNDR-001..VNDR-028 + PROD-001..PROD-034 | 62 |
| M4 Search | SRCH-001..SRCH-022 | 22 |
| M5 Order + Payment | ORDR-001..ORDR-027 + PAYM-001..PAYM-022 | 49 |
| M6 Delivery + Notify | DLVR-001..DLVR-018 + NTFY-001..NTFY-015 | 33 |
| M7 Review + AI core | RVW-001..RVW-016 + AI-001..AI-018 | 34 |
| M8 Analytics + Admin | ANLY-001..ANLY-014 + ADMN-001..ADMN-017 | 31 |
| M9 MVP launch | MVP-001..MVP-026 | 26 |

Check commands per milestone:

```bash
grep -c "^- \[ \]" docs/todos.md
grep -n "^- \[ \]" docs/todos.md | head -5
grep -n "M2" docs/progress.md | head -10
```

## Appendix A - Task Index

Auto-generated counts. Use `grep -n "PREFIX-" docs/todos.md` to jump to any group. Total: 504 tasks.

| Prefix | Phase / Wave | Count | ID range |
| :--- | :--- | :---: | :--- |
| P0 | Phase 0 repo hygiene | 28 | P0-001..P0-028 |
| P1 | Phase 1 prerequisites | 24 | P1-001..P1-024 |
| P2 | Phase 2 scaffold | 42 | P2-001..P2-042 |
| P3 | Phase 3 infra | 28 | P3-001..P3-028 |
| P4 | Phase 4 env | 18 | P4-001..P4-018 |
| P5 | Phase 5 foundation | 45 | P5-001..P5-045 |
| AUTH | Wave 1 auth | 30 | AUTH-001..AUTH-030 |
| USER | Wave 2 user | 32 | USER-001..USER-032 |
| VNDR | Wave 3 vendor | 28 | VNDR-001..VNDR-028 |
| PROD | Wave 4 product | 34 | PROD-001..PROD-034 |
| SRCH | Wave 5 search | 22 | SRCH-001..SRCH-022 |
| ORDR | Wave 6 order | 27 | ORDR-001..ORDR-027 |
| PAYM | Wave 6 payment | 22 | PAYM-001..PAYM-022 |
| DLVR | Wave 7 delivery | 18 | DLVR-001..DLVR-018 |
| NTFY | Wave 8 notification | 15 | NTFY-001..NTFY-015 |
| RVW | Wave 9 review | 16 | RVW-001..RVW-016 |
| ANLY | Wave 10 analytics | 14 | ANLY-001..ANLY-014 |
| AI | Wave 11 AI | 18 | AI-001..AI-018 |
| ADMN | Wave 12 admin | 17 | ADMN-001..ADMN-017 |
| MVP | Launch gate | 26 | MVP-001..MVP-026 |

Quick navigation commands:

```bash
grep -n "^- \[ \] P0-" docs/todos.md | head -30
grep -n "^- \[ \] AUTH-" docs/todos.md | head -35
grep -c "^- \[x\]" docs/todos.md
grep -c "^- \[ \]" docs/todos.md
```

Progress math: done = `grep -c "^- \[x\]"`, remaining = `grep -c "^- \[ ]"`, percent = done / 504 * 100. Update docs/progress.md percent rule: 0 = Planned, 1-99 = In Progress, 100 = Done.

## Appendix B - PR Grouping Guide

Rule from docs/git-conventions.md: one topic per PR, short-lived branches off develop, PR title follows `type(scope): description`, PR body links US/FR + task IDs, docs/progress.md updated in the same PR. Suggested slices below (each row = one PR, 1-8 tasks).

### Phases 0-5 suggested PRs

| PR title | Tasks | Notes |
| :--- | :--- | :--- |
| chore(repo): inspect baseline P0-001..P0-008 | P0-001..P0-008 | read-only, no code |
| chore(repo): scaffold decision P0-009..P0-013 | P0-009..P0-013 | decision note + progress |
| chore(git): develop branch + protection P0-014..P0-018 | P0-014..P0-018 | needs repo admin |
| docs(baseline): commit docs P0-019..P0-023 | P0-019..P0-023 | first merged PR |
| chore(stack): lock stack decisions P0-024..P0-028 | P0-024..P0-028 | blocks Phase 2 |
| chore(env): node + package manager P1-001..P1-008 | P1-001..P1-008 | per machine |
| chore(env): docker + git config P1-009..P1-016 | P1-009..P1-016 | per machine |
| chore(editor): extensions + verify P1-017..P1-024 | P1-017..P1-024 | per machine |
| feat(scaffold): backend top-level P2-007..P2-022 | P2-007..P2-022 | package.json + configs |
| feat(scaffold): src layout P2-023..P2-039 | P2-023..P2-039 | dirs + stubs |
| feat(scaffold): client + boot P2-040..P2-042 | P2-040..P2-042 | dev green gate |
| chore(infra): compose services P3-001..P3-014 | P3-001..P3-014 | yml only |
| chore(infra): boot + verify P3-015..P3-028 | P3-015..P3-028 | needs docker |
| chore(config): env groups P4-001..P4-015 | P4-001..P4-015 | .env.example |
| feat(config): zod env + fail-fast P4-016..P4-018 | P4-016..P4-018 | boot gate |
| chore(deps): runtime + AI + messaging P5-001..P5-009 | P5-001..P5-009 | lockfile |
| feat(core): logger + prisma + errors P5-010..P5-018 | P5-010..P5-018 | shared kernel |
| feat(core): health + rbac + ratelimit P5-019..P5-028 | P5-019..P5-028 | middleware |
| chore(tooling): tsconfig eslint jest P5-029..P5-033 | P5-029..P5-033 | configs |
| ci(pipeline): workflow + hooks P5-034..P5-045 | P5-034..P5-045 | green pipeline gate |

### Waves 1-6 suggested PRs

| PR title | Tasks | Notes |
| :--- | :--- | :--- |
| feat(auth): register + login AUTH-001..AUTH-003 | AUTH-001..AUTH-003 | migration + 2 endpoints |
| feat(auth): refresh + logout + me AUTH-004 AUTH-005 AUTH-011 | AUTH-004 AUTH-005 AUTH-011 | session trio |
| feat(auth): oauth google AUTH-006 AUTH-007 | AUTH-006 AUTH-007 | redirect + callback |
| feat(auth): otp + password reset AUTH-008..AUTH-010 AUTH-012 | AUTH-008..AUTH-010 AUTH-012 | 4 endpoints |
| test(auth): policy + creds + refresh AUTH-013..AUTH-015 | AUTH-013..AUTH-015 | behavior tests |
| test(auth): rbac + ratelimit + otp AUTH-016..AUTH-020 | AUTH-016..AUTH-020 | behavior tests |
| feat(ui): auth screens AUTH-021..AUTH-026 | AUTH-021..AUTH-026 | 6 screens |
| feat(ui): error screens AUTH-027..AUTH-029 | AUTH-027..AUTH-029 | 403/404/500/maintenance |
| feat(user): profile + avatar USER-001..USER-004 | USER-001..USER-004 | migration + endpoints |
| feat(user): addresses USER-005..USER-008 | USER-005..USER-008 | 4 endpoints + geocode |
| feat(user): prefs + wishlist USER-009..USER-013 | USER-009..USER-013 | 5 endpoints |
| feat(user): gdpr export + delete USER-014 USER-015 | USER-014 USER-015 | async + anonymize |
| test(user): invariants USER-016..USER-023 | USER-016..USER-023 | 8 behavior tests |
| feat(ui): user screens USER-024..USER-030 | USER-024..USER-030 | 7 screens |
| feat(vendor): register + kyc VNDR-001..VNDR-003 | VNDR-001..VNDR-003 | migration + 2 endpoints |
| feat(vendor): store + commission + dashboard VNDR-004..VNDR-009 | VNDR-004..VNDR-009 | 6 endpoints |
| test(vendor): gates VNDR-010..VNDR-017 | VNDR-010..VNDR-017 | state machine + gates |
| feat(ui): vendor screens VNDR-018..VNDR-027 | VNDR-018..VNDR-027 | 10 screens |
| feat(product): models + crud PROD-001..PROD-013 | PROD-001..PROD-013 | migrations + endpoints |
| feat(product): sku + images + categories PROD-014..PROD-019 | PROD-014..PROD-019 | guards + uploads |
| feat(product): inventory + import + ai PROD-020..PROD-029 | PROD-020..PROD-029 | ledger + jobs + sync |
| test(product): races PROD-030 PROD-031 | PROD-030 PROD-031 | 409 shapes |
| feat(search): index + hybrid SRCH-001..SRCH-005 | SRCH-001..SRCH-005 | ES + pinecone + merge |
| feat(search): endpoints + fallback SRCH-006..SRCH-013 | SRCH-006..SRCH-013 | 4 endpoints + guards |
| test(search): fallback + paging SRCH-014..SRCH-017 | SRCH-014..SRCH-017 | behavior tests |
| feat(order): cart + checkout ORDR-001..ORDR-010 | ORDR-001..ORDR-010 | redis + idempotency |
| feat(order): saga + lifecycle ORDR-011..ORDR-019 | ORDR-011..ORDR-019 | orchestrator + guards |
| feat(payment): intent + webhook PAYM-001..PAYM-006 | PAYM-001..PAYM-006 | split + upsert race |
| feat(payment): refund + payout PAYM-007..PAYM-010 | PAYM-007..PAYM-010 | finance rules |
| test(order-payment): races ORDR-020 ORDR-021 PAYM-013..PAYM-015 | ORDR-020 ORDR-021 PAYM-013..PAYM-015 | 5 critical tests |

### Waves 7-12 + MVP suggested PRs

| PR title | Tasks | Notes |
| :--- | :--- | :--- |
| feat(delivery): models + assign DLVR-001..DLVR-005 | DLVR-001..DLVR-005 | postgis + window |
| feat(delivery): tracking + proof DLVR-006..DLVR-011 | DLVR-006..DLVR-011 | WS + upload |
| feat(notify): fan-out + templates NTFY-001..NTFY-004 | NTFY-001..NTFY-004 | services |
| feat(notify): endpoints + bell NTFY-005..NTFY-012 | NTFY-005..NTFY-012 | 5 endpoints + UI |
| feat(review): gate + moderation RVW-001..RVW-009 | RVW-001..RVW-009 | 0.8 threshold |
| feat(analytics): ingest + dashboard ANLY-001..ANLY-009 | ANLY-001..ANLY-009 | clickhouse |
| feat(ai): chat + quota + fraud AI-001..AI-010 | AI-001..AI-010 | stream + scorer |
| feat(admin): approve + ban + audit ADMN-001..ADMN-011 | ADMN-001..ADMN-011 | rbac + immutable |
| test(e2e): waves 7-12 DLVR-015..ADMN-016 | per-wave test IDs | UI + integration |
| chore(release): MVP gate MVP-001..MVP-026 | MVP-001..MVP-026 | staging smoke only |

## Definition of Done (per task type)

A task is done only when its Verify passes AND the matching checks below pass. Check the box `- [x]` only then.

Migration task done when:

- `npx prisma validate` exits 0
- `npx prisma migrate dev --name <wave>` applies cleanly on a fresh database
- `npx prisma generate` regenerates client without warnings
- down-migration or restore path documented in the PR body

Endpoint task done when:

- happy path returns the documented status + envelope (docs/error-codes.md S2)
- every listed error code is reachable and returns its documented HTTP + code
- auth/role gate tested (authed, wrong role, no token)
- rate limit noted if in docs/api.md S19 group

Test task done when:

- `npm run test -- <name>` passes in isolation and in full suite
- test fails if the implementation is reverted (mutation check by eye)

UI task done when:

- route renders per docs/ui-flows.md spec at 360px and 1280px
- empty, loading, and error states from docs/ui-flows.md S10 implemented
- branch on `code`, never on message text (docs/error-codes.md S4)

Wave-close task done when:

- docs/progress.md checkboxes for the wave's US range checked in the same PR
- CI green (lint + typecheck + test + build + migrate-check)

## How to Resume After a Break

1. Run `git status -sb` and `git log --oneline -5` to see where you stopped.
2. Run `grep -n "^- \[ \]" docs/todos.md | head -5` to find the first unchecked task.
3. Read that task's references (US/FR + doc sections) before coding.
4. Complete it, run its Verify, check the box, open the PR per Appendix B.
5. Never check boxes in bulk. One Verify per box.

---

## Common Failure Recoveries

When a Verify fails, find your symptom below, fix, re-run the Verify, then continue. Do not check the box until green.

| Symptom | Likely cause | Fix |
| :--- | :--- | :--- |
| `docker: command not found` | docker not installed | redo P1-009..P1-011 |
| container Exited in `docker ps` | bad env or port clash | `docker logs <name>`, check P3-009, free the port |
| `pg_isready` refuses | postgres still starting | wait 10s, rerun; check P3-011 healthcheck |
| `PONG` missing from redis-cli | wrong port or container down | check P3-003, P3-022 |
| prisma `P1001 cannot reach DB` | DATABASE_URL mismatch | compare .env vs P3-023 string |
| `zod` boot exit on start | missing required env | diff .env against .env.example keys (P4-016) |
| port 5000 already in use | stale dev server | kill process, rerun P2-042 |
| jest fails only in full suite | test pollution / shared DB | run single file, check setup.ts isolation (P5-032) |
| 429 on first local call | limiter reading prod defaults | check RATE_LIMIT_WINDOW_MS (P4-015) |
| webhook 400 signature | JSON parser ate raw body | exclude route from express.json (PAYM-003) |
| migration drift warning | edited applied migration | never edit applied SQL; create new migration (DoD) |
| checked box but CI red | local-only pass | uncheck, fix, push, wait green (Appendix B) |

---

## Changelog

| Version | Date | Change |
| :--- | :--- | :--- |
| 1.0.0 | 2026-09-05 | Initial full breakdown: 504 tasks across Phases 0-5, Waves 1-12, MVP gate |
| Unreleased | — | Add rows here per change; keep version + date current on every edit |

*This file is exhaustive by design (504 tasks). It stays correct only if every PR checks its boxes and updates docs/progress.md alongside. Stale checkbox = stale plan.*

<!-- todos.md v1.0.0 - 504 tasks across Phases 0-5, Waves 1-12, MVP gate + appendices -->

