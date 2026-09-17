import { Router, Request, Response } from 'express';
import { db } from '../db/store';

const router = Router();

// /sitemap.xml
router.get('/sitemap.xml', (req: Request, res: Response) => {
  const baseUrl = process.env.APP_URL || `http://${req.headers.host || 'localhost:3000'}`;
  const properties = db.getProperties({ limit: 100 }).properties;

  const staticPages = [
    '',
    '/properties',
    '/buy',
    '/rent',
    '/about',
    '/contact',
    '/submit-property',
    '/privacy-policy',
    '/terms'
  ];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  staticPages.forEach(path => {
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}${path}</loc>\n`;
    xml += `    <changefreq>daily</changefreq>\n`;
    xml += `    <priority>${path === '' ? '1.0' : '0.8'}</priority>\n`;
    xml += `  </url>\n`;
  });

  properties.forEach(p => {
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}/properties/${p.slug}</loc>\n`;
    xml += `    <lastmod>${new Date(p.updatedAt).toISOString().split('T')[0]}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.9</priority>\n`;
    xml += `  </url>\n`;
  });

  xml += `</urlset>`;

  res.header('Content-Type', 'application/xml');
  res.send(xml);
});

// /robots.txt
router.get('/robots.txt', (req: Request, res: Response) => {
  const baseUrl = process.env.APP_URL || `http://${req.headers.host || 'localhost:3000'}`;
  const text = `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\n\nSitemap: ${baseUrl}/sitemap.xml\n`;
  res.header('Content-Type', 'text/plain');
  res.send(text);
});

export default router;
