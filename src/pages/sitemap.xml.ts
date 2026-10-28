import type { APIRoute } from 'astro';
import { SITE_URL } from '../data/site-config.mjs';

export const prerender = true;

const escapeXml = (value: string) => value.replace(/[<>&"']/g, character => ({
  '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;',
}[character]!));

// Sections are anchors within the homepage, not separate indexable pages.
export const GET: APIRoute = () => new Response(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${escapeXml(SITE_URL)}</loc></url>
</urlset>
`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
