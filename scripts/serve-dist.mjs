#!/usr/bin/env node
// Tiny static server that mimics what Apache + .htaccess does on Hostinger:
//  - /foo  → dist/foo/index.html (if it exists), else dist/foo (if file), else 404.html (status 404)
//  - /     → dist/index.html
// Just enough to run the Playwright audit against the local prerender.
import { createServer } from 'node:http';
import { readFileSync, statSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';

const ROOT = resolve(process.cwd(), 'dist');
const PORT = parseInt(process.env.PORT || '8787', 10);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
};

function safeStat(p) { try { return statSync(p); } catch { return null; } }

const server = createServer((req, res) => {
  let urlPath = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (urlPath.includes('..')) { res.writeHead(400); return res.end('bad'); }

  const candidates = [];
  if (urlPath === '/') {
    candidates.push(join(ROOT, 'index.html'));
  } else {
    const trimmed = urlPath.replace(/\/$/, '');
    candidates.push(join(ROOT, trimmed, 'index.html'));
    candidates.push(join(ROOT, trimmed));
    candidates.push(join(ROOT, urlPath));
  }

  for (const p of candidates) {
    const s = safeStat(p);
    if (s && s.isFile()) {
      const type = MIME[extname(p).toLowerCase()] || 'application/octet-stream';
      res.writeHead(200, { 'content-type': type, 'cache-control': 'no-cache' });
      return res.end(readFileSync(p));
    }
  }

  // 404
  const f404 = join(ROOT, '404.html');
  const s404 = safeStat(f404);
  if (s404 && s404.isFile()) {
    res.writeHead(404, { 'content-type': 'text/html; charset=utf-8' });
    return res.end(readFileSync(f404));
  }
  res.writeHead(404, { 'content-type': 'text/plain' });
  return res.end('not found');
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`[serve-dist] listening on http://127.0.0.1:${PORT} root=${ROOT}`);
});
