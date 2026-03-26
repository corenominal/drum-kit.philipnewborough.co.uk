#!/usr/bin/env node

/**
 * cache-bust.js
 *
 * Generates content-hashed filenames for main.css and main.js,
 * renames the files, cleans up stale versioned copies, and
 * updates the references in public/index.html and public/sw.js
 * (including bumping the SW cache version).
 *
 * Usage: node cache-bust.js
 */

import { createHash } from 'crypto';
import { readFileSync, writeFileSync, renameSync, readdirSync, unlinkSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const CSS_DIR = join(__dirname, 'public', 'css');
const JS_DIR  = join(__dirname, 'public', 'js');
const HTML    = join(__dirname, 'public', 'index.html');
const SW      = join(__dirname, 'public', 'sw.js');

const TARGETS = [
  { dir: CSS_DIR, src: 'main.css',  pattern: /^main-[a-f0-9]+\.css$/, htmlRef: /css\/main(?:-[a-f0-9]+)?\.css/, swRef: /\/css\/main(?:-[a-f0-9]+)?\.css/ },
  { dir: JS_DIR,  src: 'main.js',   pattern: /^main-[a-f0-9]+\.js$/,  htmlRef: /js\/main(?:-[a-f0-9]+)?\.js/,  swRef: /\/js\/main(?:-[a-f0-9]+)?\.js/  },
];

function shortHash(filePath) {
  const content = readFileSync(filePath);
  return createHash('md5').update(content).digest('hex').slice(0, 8);
}

let html = readFileSync(HTML, 'utf8');
let sw   = readFileSync(SW, 'utf8');

for (const { dir, src, pattern, htmlRef, swRef } of TARGETS) {
  const ext  = src.slice(src.lastIndexOf('.'));    // .css or .js
  const base = src.slice(0, src.lastIndexOf('.')); // main

  // Resolve source: prefer the unversioned file, fall back to any existing versioned copy
  let srcPath = join(dir, src);
  if (!existsSync(srcPath)) {
    const existing = readdirSync(dir).find(f => pattern.test(f));
    if (!existing) throw new Error(`Cannot find source file for ${src} in ${dir}`);
    srcPath = join(dir, existing);
  }

  const hash      = shortHash(srcPath);
  const versioned = `${base}-${hash}${ext}`;
  const destPath  = join(dir, versioned);

  // Remove stale versioned copies (skip the one we're about to create)
  for (const file of readdirSync(dir)) {
    if (pattern.test(file) && file !== versioned) {
      unlinkSync(join(dir, file));
      console.log(`Removed stale: ${file}`);
    }
  }

  // Rename to the versioned name (no-op if hash hasn't changed)
  if (srcPath !== destPath) {
    renameSync(srcPath, destPath);
    console.log(`Renamed: ${srcPath.split('/').pop()} → ${versioned}`);
  } else {
    console.log(`Unchanged: ${versioned}`);
  }

  // Update the HTML reference
  const subdir = dir.includes('css') ? 'css' : 'js';
  html = html.replace(htmlRef, `${subdir}/${versioned}`);

  // Update the SW ASSETS reference
  sw = sw.replace(swRef, `/${subdir}/${versioned}`);
}

// Bump the SW CACHE_NAME version number so old caches are purged
sw = sw.replace(
  /(const CACHE_NAME\s*=\s*['"][^'"]+-)(\d+)(['"]\s*;)/,
  (_, prefix, num, suffix) => `${prefix}${parseInt(num, 10) + 1}${suffix}`
);

writeFileSync(HTML, html, 'utf8');
console.log('Updated: public/index.html');

writeFileSync(SW, sw, 'utf8');
console.log('Updated: public/sw.js');
