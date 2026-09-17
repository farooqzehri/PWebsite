import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

// Route imports
import propertiesRouter from './server/routes/properties';
import categoriesRouter from './server/routes/categories';
import locationsRouter from './server/routes/locations';
import inquiriesRouter from './server/routes/inquiries';
import testimonialsRouter from './server/routes/testimonials';
import settingsRouter from './server/routes/settings';
import authRouter from './server/routes/auth';
import uploadRouter from './server/routes/upload';
import adminRouter from './server/routes/admin';
import seoRouter from './server/routes/seo';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON Body parser with reasonable limit for image previews/uploads
  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ extended: true, limit: '25mb' }));

  // SEO endpoints (sitemap.xml and robots.txt)
  app.use(seoRouter);

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', agency: 'Bismillah State Agency', location: 'Quetta, Balochistan, Pakistan' });
  });

  app.use('/api/properties', propertiesRouter);
  app.use('/api/categories', categoriesRouter);
  app.use('/api/locations', locationsRouter);
  app.use('/api/inquiries', inquiriesRouter);
  app.use('/api/testimonials', testimonialsRouter);
  app.use('/api/settings', settingsRouter);
  app.use('/api/auth', authRouter);
  app.use('/api/upload', uploadRouter);
  app.use('/api/admin', adminRouter);

  // Vite development middleware vs production static serving
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
    console.log(`Bismillah State Agency server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
