import 'dotenv/config';
import { env } from './config/env';
import { app } from './app';

// Socket.io attaches here in Wave 8 (delivery tracking). See docs/architecture.md.
app.listen(env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`NexCommerce API listening on :${env.PORT} (${env.NODE_ENV})`);
});
