// Boot entry for validated env. Schema lives in ./env.schema (side-effect
// free, safe to import in tests); this module parses process.env once and
// exits non-zero on any missing/invalid REQUIRED var (docs/env.md S12).
import { envSchema } from './env.schema';

export { envSchema } from './env.schema';
export const env = envSchema.parse(process.env);
