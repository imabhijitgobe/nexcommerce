import { env } from './env';

// Elasticsearch connection stub (product catalog search). Real client lands
// in Wave 5 (search). URL validated by env schema.
export const elasticsearchUrl: string = env.ELASTICSEARCH_URL;
export const elasticsearchIndex = 'products';
