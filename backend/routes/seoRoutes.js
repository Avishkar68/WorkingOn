import express from 'express';
import Post from '../models/Post.js';
import Project from '../models/Project.js';
import Event from '../models/Event.js';

const router = express.Router();

router.get('/sitemap', async (req, res) => {
  try {
    const posts = await Post.find({}, '_id updatedAt');
    const projects = await Project.find({}, '_id updatedAt');
    const events = await Event.find({}, '_id updatedAt');

    const BASE_URL = 'https://www.spitconnect.favmedia.in';

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${BASE_URL}</loc><priority>1.0</priority></url>
  <url><loc>${BASE_URL}/login</loc><priority>0.8</priority></url>
  <url><loc>${BASE_URL}/register</loc><priority>0.8</priority></url>
  <url><loc>${BASE_URL}/landing</loc><priority>0.8</priority></url>
  <url><loc>${BASE_URL}/blog</loc><priority>0.8</priority></url>`;

    posts.forEach(post => {
      sitemap += `
  <url>
    <loc>${BASE_URL}/posts/${post._id}</loc>
    <lastmod>${post.updatedAt.toISOString()}</lastmod>
    <priority>0.6</priority>
  </url>`;
    });

    projects.forEach(project => {
      sitemap += `
  <url>
    <loc>${BASE_URL}/projects/${project._id}</loc>
    <lastmod>${project.updatedAt.toISOString()}</lastmod>
    <priority>0.6</priority>
  </url>`;
    });

    events.forEach(event => {
      sitemap += `
  <url>
    <loc>${BASE_URL}/events/${event._id}</loc>
    <lastmod>${event.updatedAt.toISOString()}</lastmod>
    <priority>0.6</priority>
  </url>`;
    });

    sitemap += '\n</urlset>';

    res.header('Content-Type', 'application/xml');
    res.send(sitemap);
  } catch (error) {
    res.status(500).send('Error generating sitemap');
  }
});

export default router;
