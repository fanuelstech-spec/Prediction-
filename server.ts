import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { apiRouter } from './src/server/routes.ts';
import { seedInitialData } from './src/db/seed.ts';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Request parsing
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Seed database if empty
  seedInitialData().catch((err) => {
    console.error('Initial data seed error:', err);
  });

  // Mount API router FIRST
  app.use('/api', apiRouter);

  // Vite middleware in development vs static serving in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ApexPicks server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal startup error:', err);
});
