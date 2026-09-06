// Jest global setup (todos P2-039). DB teardown/mocking lands in Phase 5.
export default async function setup(): Promise<void> {
  process.env.NODE_ENV = 'test';
}
