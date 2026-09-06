import { env } from './env';

// Pinecone connection stub (vectors for semantic search + RAG). Real client
// lands in Wave 5 (search) / Wave 11 (AI). Key presence validated by env schema.
export const pineconeApiKey: string = env.PINECONE_API_KEY;
export const pineconeIndex = 'products';
