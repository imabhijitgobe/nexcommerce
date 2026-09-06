// Structured logger stub. Full pino logger lands in Phase 5 (P5-010);
// this stub keeps 2.3 green with zero extra dependencies.
export const logger =
  process.env.NODE_ENV === 'test'
    ? { info: () => undefined, warn: () => undefined, error: () => undefined, debug: () => undefined }
    : console;
