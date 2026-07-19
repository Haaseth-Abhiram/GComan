#!/usr/bin/env node
/**
 * scan-bordered-surfaces.mjs
 *
 * Scans src/pages and src/components (excluding src/components/ui) for
 * bordered surfaces that are candidates for the animated `.logo-gradient-border`
 * treatment but do not yet use it.
 *
 * A "bordered surface" is heuristically any className that contains:
 *   - `border-2` (explicit 2px border), OR
 *   - both a `border`-family utility AND a `rounded`-family utility on the
 *     same element (card-like container).
 *
 * Elements are ignored when the className already includes
 * `logo-gradient-border`, or when the match looks like a small UI accent
 * (spinner, scroll indicator, input, dashed uploader, dialog frame, etc.).
 *
 * Usage:
 *   node scripts/scan-bordered-surfaces.mjs
 *   node scripts/scan-bordered-surfaces.mjs --json
 *
 * Exit code: 0 if no candidates, 1 if candidates were found (CI-friendly).
 */

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.cwd();
const SCAN_DIRS = ['src/pages', 'src/components'];
const EXCLUDE_DIRS = ['src/components/ui'];
const FILE_EXT = /\.(tsx|jsx)$/;

// Skip patterns — small UI accents that intentionally keep a plain border.
const IGNORE_HINTS = [
  'animate-spin',           // loading spinners
  'border-dashed',          // upload zones
  'border-t-primary',       // spinner rings
  'rounded-full',           // scroll indicators / avatar rings / pills
  'DialogContent',          // dialog frames (handled by shadcn)
  'focus:border',           // input focus rings
  'h-14 text-base',         // large search input
];

function walk(dir, out = []) {
  const abs = join(ROOT, dir);
  let entries;
  try { entries = readdirSync(abs); } catch { return out; }
  for (const name of entries) {
    const full = join(abs, name);
    const rel = relative(ROOT, full);
    if (EXCLUDE_DIRS.some((ex) => rel === ex || rel.startsWith(ex + '/'))) continue;
    const st = statSync(full);
    if (st.isDirectory()) walk(rel, out);
    else if (FILE_EXT.test(name)) out.push(rel);
  }
  return out;
}

// Extract className string literals from a line (className="..." | class="...").
const CLASS_RE = /class(?:Name)?\s*=\s*["'`]([^"'`]+)["'`]/g;

function isBorderedSurface(cls) {
  if (cls.includes('logo-gradient-border')) return false;
  if (/\bborder-2\b/.test(cls)) return true;
  const hasBorder = /\bborder(?:-[trblxy])?(?:-\[?\w|-\d|\s|$)/.test(cls) ||
                    /\bborder\b/.test(cls);
  const hasRounded = /\brounded(?:-\w+)?\b/.test(cls);
  return hasBorder && hasRounded;
}

function isIgnorable(line) {
  return IGNORE_HINTS.some((h) => line.includes(h));
}

function scan() {
  const files = SCAN_DIRS.flatMap((d) => walk(d));
  const findings = [];
  for (const file of files) {
    const src = readFileSync(join(ROOT, file), 'utf8');
    const lines = src.split('\n');
    lines.forEach((line, i) => {
      if (isIgnorable(line)) return;
      let m;
      CLASS_RE.lastIndex = 0;
      while ((m = CLASS_RE.exec(line)) !== null) {
        const cls = m[1];
        if (isBorderedSurface(cls)) {
          findings.push({ file, line: i + 1, className: cls.trim(), snippet: line.trim() });
        }
      }
    });
  }
  return findings;
}

const findings = scan();
const asJson = process.argv.includes('--json');

if (asJson) {
  console.log(JSON.stringify({ count: findings.length, findings }, null, 2));
} else if (findings.length === 0) {
  console.log('✓ No bordered surfaces missing .logo-gradient-border.');
} else {
  console.log(`Found ${findings.length} bordered surface(s) not using .logo-gradient-border:\n`);
  for (const f of findings) {
    console.log(`  ${f.file}:${f.line}`);
    console.log(`    ${f.snippet}`);
    console.log('');
  }
  console.log('Review each match. Upgrade card-like surfaces to `logo-gradient-border`;');
  console.log('keep small accents (spinners, focus rings, dashed uploaders) as-is.');
}

process.exit(findings.length === 0 ? 0 : 1);
