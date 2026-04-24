import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://www.spitconnect.favmedia.in';

const staticRoutes = [
  '',
  '/login',
  '/register',
  '/landing',
  '/landing/our-team',
  '/opportunities',
  '/academic-help',
  '/projects',
  '/events',
  '/explore',
  '/campus-pulse',
  '/search',
  '/blog',
  '/blog/networking-for-spit-students',
  '/blog/spit-internship-guide-2026',
  '/blog/project-collaboration-tips'
];

const generateSitemap = () => {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticRoutes
    .map((route) => {
      return `
    <url>
      <loc>${BASE_URL}${route}</loc>
      <changefreq>weekly</changefreq>
      <priority>${route === '' ? '1.0' : '0.8'}</priority>
    </url>`;
    })
    .join('')}
</urlset>`;

  const publicDir = path.resolve('public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
  }

  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
  console.log('✅ sitemap.xml generated successfully in public directory!');
};

generateSitemap();
