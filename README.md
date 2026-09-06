# NexCommerce

AI-powered multi-vendor e-commerce platform (modular monolith: Node.js + Express + Prisma).

## Setup

See `docs/architecture.md` Section 16 and `docs/todos.md` Phase 1-3. Quick start:

```bash
cp .env.example .env
pnpm install
docker compose -f docker/docker-compose.yml up -d
npx prisma generate
npx prisma migrate dev
pnpm dev
```

API: `http://localhost:5000/api/v1` (see `docs/api.md`).

## Scripts

| Script | Command |
| :--- | :--- |
| dev | `pnpm dev` (tsx watch src/server.ts) |
| build | `pnpm build` (tsc -p tsconfig.build.json) |
| test | `pnpm test` (jest --runInBand) |
| lint | `pnpm lint` (eslint src) |
| typecheck | `pnpm typecheck` (tsc --noEmit) |

Conventions: `docs/git-conventions.md`. Tasks: `docs/todos.md`.
