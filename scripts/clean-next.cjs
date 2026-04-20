/**
 * Removes the Next.js cache (.next). Fixes dev 404s on /_next/static/chunks/fallback/*
 * when the HTML error shell and compiled chunks are out of sync.
 */
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', '.next');
if (fs.existsSync(dir)) {
  fs.rmSync(dir, { recursive: true, force: true });
  console.log('Removed .next');
} else {
  console.log('.next already absent');
}
