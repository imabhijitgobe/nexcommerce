// Prisma client singleton per docs/architecture.md S8.
//
// NOTE: no models exist yet (they land wave by wave, first in Wave 1
// AUTH-001), so `prisma generate` currently emits no client. Resolve lazily
// so the scaffold typechecks and boots today; switch to a direct
// `import { PrismaClient } from '@prisma/client'` once the first model lands.

type PrismaClientLike = {
  $connect: () => Promise<void>;
  $disconnect: () => Promise<void>;
};

function createClient(): PrismaClientLike {
  const { PrismaClient } = require('@prisma/client') as {
    PrismaClient: new () => PrismaClientLike;
  };
  return new PrismaClient();
}

let cached: PrismaClientLike | undefined;

/** Singleton Prisma client. Do not call before `prisma generate` has run. */
export function getPrisma(): PrismaClientLike {
  if (!cached) {
    cached = createClient();
  }
  return cached;
}
