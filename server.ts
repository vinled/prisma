import express from 'express';
import path from 'node:path';
import { createServer as createViteServer, loadEnv } from 'vite';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import generateCaption from './api/generate-caption';
import createCheckout from './api/create-checkout';
import cancelSubscription from './api/cancel-subscription';
import asaasWebhook from './api/webhook/asaas';

async function startServer() {
  const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development';
  const env = loadEnv(mode, process.cwd(), '');
  for (const [key, value] of Object.entries(env)) {
    if (process.env[key] === undefined) process.env[key] = value;
  }
  const port = Number(process.env.PORT || 3000);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('PORT deve ser um número entre 1 e 65535.');
  }
  const host = process.env.HOST || '127.0.0.1';
  const app = express();
  app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: false,
    crossOriginOpenerPolicy: false,
    frameguard: false,
    strictTransportSecurity: mode === 'production',
  }));
  app.use(express.json({ limit: '64kb' }));
  app.get('/api/health', (_req, res) => res.json({ app: 'PostNaMao', status: 'ok', mode }));
  app.post('/api/generate-caption', rateLimit({
    windowMs: 60_000,
    limit: 10,
    message: { error: 'Muitas requisições. Tente novamente em um minuto.' },
  }), generateCaption);
  const billingLimiter = rateLimit({ windowMs: 60_000, limit: 5 });
  app.post('/api/create-checkout', billingLimiter, createCheckout);
  app.post('/api/cancel-subscription', billingLimiter, cancelSubscription);
  app.post('/api/webhook/asaas', asaasWebhook);
  app.use('/api', (_req, res) => res.status(404).json({ error: 'API não encontrada.' }));

  if (mode !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => res.sendFile(path.join(distPath, 'index.html')));
  }
  const server = app.listen(port, host, () => {
    console.log(`PostNaMão disponível em http://localhost:${port}`);
  });
  server.on('error', (error: NodeJS.ErrnoException) => {
    console.error(error.code === 'EADDRINUSE'
      ? `A porta ${port} já está ocupada. Feche o outro servidor ou altere PORT no .env.local.`
      : error.message);
    process.exitCode = 1;
  });
}

startServer().catch((error) => {
  console.error('Não foi possível iniciar o PostNaMão:', error.message);
  process.exitCode = 1;
});
