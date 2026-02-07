#!/usr/bin/env node
/**
 * generate-sitemap.js
 *
 * Fetches `lost_found_items` and `community_posts` from Supabase and
 * writes a `sitemap.xml` file at the repository root with absolute URLs.
 *
 * Usage (locally):
 *   SUPABASE_URL=<url> SUPABASE_KEY=<anon_key> node scripts/generate-sitemap.js
 *
 * On CI (Vercel/GitHub Actions): set `SUPABASE_URL` and `SUPABASE_KEY` as secrets
 * and run the script as part of your build to produce an up-to-date sitemap.
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const SITE_ORIGIN = process.env.SITE_ORIGIN || 'https://nexassearch.com';

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_KEY environment variables.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function fetchRows(table, columns = '*') {
  const { data, error } = await supabase.from(table).select(columns);
  if (error) throw error;
  return data || [];
}

function toIsoDate(dateStr) {
  if (!dateStr) return new Date().toISOString();
  const d = new Date(dateStr);
  return d.toISOString();
}

function buildUrlset(entries) {
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
  ];

  for (const e of entries) {
    lines.push('  <url>');
    lines.push(`    <loc>${e.loc}</loc>`);
    if (e.lastmod) lines.push(`    <lastmod>${e.lastmod}</lastmod>`);
    lines.push(`    <changefreq>${e.changefreq || 'weekly'}</changefreq>`);
    lines.push(`    <priority>${e.priority || '0.5'}</priority>`);
    lines.push('  </url>');
  }

  lines.push('</urlset>');
  return lines.join('\n');
}

async function main() {
  console.log('Generating sitemap from Supabase...');

  const entries = [];

  // Static main pages
  entries.push({ loc: `${SITE_ORIGIN}/`, lastmod: new Date().toISOString(), changefreq: 'daily', priority: '1.0' });
  entries.push({ loc: `${SITE_ORIGIN}/lost-and-found/`, lastmod: new Date().toISOString(), changefreq: 'daily', priority: '0.9' });
  entries.push({ loc: `${SITE_ORIGIN}/community/`, lastmod: new Date().toISOString(), changefreq: 'daily', priority: '0.8' });
  entries.push({ loc: `${SITE_ORIGIN}/category/`, lastmod: new Date().toISOString(), changefreq: 'weekly', priority: '0.7' });
  entries.push({ loc: `${SITE_ORIGIN}/swap/`, lastmod: new Date().toISOString(), changefreq: 'weekly', priority: '0.7' });
  entries.push({ loc: `${SITE_ORIGIN}/help/faq.html`, lastmod: new Date().toISOString(), changefreq: 'monthly', priority: '0.6' });

  try {
    // Fetch lost items
    const lost = await fetchRows('lost_found_items', 'id, slug, created_at, updated_at');
    for (const item of lost) {
      const loc = `${SITE_ORIGIN}/lost-and-found/detail.html?id=${encodeURIComponent(item.id)}`;
      entries.push({ loc, lastmod: toIsoDate(item.updated_at || item.created_at), changefreq: 'weekly', priority: '0.6' });
    }

    // Fetch community posts (if table exists)
    let community = [];
    try {
      community = await fetchRows('community_posts', 'id, slug, created_at, updated_at');
    } catch (err) {
      console.warn('Could not fetch community_posts table:', err.message);
    }

    for (const post of community) {
      const loc = `${SITE_ORIGIN}/community/detail.html?id=${encodeURIComponent(post.id)}`;
      entries.push({ loc, lastmod: toIsoDate(post.updated_at || post.created_at), changefreq: 'weekly', priority: '0.5' });
    }

    const xml = buildUrlset(entries);
    const outPath = path.join(__dirname, '..', 'sitemap.xml');
    fs.writeFileSync(outPath, xml, 'utf8');
    console.log('Wrote sitemap to', outPath);

  } catch (error) {
    console.error('Error generating sitemap:', error.message || error);
    process.exit(1);
  }
}

main();
