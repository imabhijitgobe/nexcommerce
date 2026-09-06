import { env } from './env';

// Redis connection stub (cache, sessions, BullMQ backing). Real client +
// connection management land in Phase 5. REDIS_URL validated by env schema.
export const redisUrl: string = env.REDIS_URL;
