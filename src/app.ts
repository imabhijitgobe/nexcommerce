import express from 'express';
import helmet from 'helmet';
import cors from 'cors';

export const app: express.Express = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/health/live', (_req, res) => {
  res.json({ ok: true });
});
