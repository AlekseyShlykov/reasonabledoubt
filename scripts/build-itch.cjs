#!/usr/bin/env node
/**
 * Builds the static site for an itch.io HTML5 upload.
 *
 * itch.io serves uploaded zips at an unpredictable deep path
 * (e.g. https://html-classic.itch.zone/html/<id>/index.html), so we need:
 *  - relative asset paths (NEXT_PUBLIC_ASSET_PREFIX=.)
 *  - relative inter-page navigation via *.html files (NEXT_PUBLIC_RELATIVE_NAV=1)
 *  - no GitHub Pages basePath
 *
 * Output: ./itch-build/ (zip its contents — not the folder itself — for upload).
 */
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'out');
const ITCH_DIR = path.join(ROOT, 'itch-build');
const ZIP_NAME = 'reasonable-doubt-itch.zip';
const ZIP_PATH = path.join(ROOT, ZIP_NAME);

function run(cmd, args, env) {
  const result = spawnSync(cmd, args, {
    cwd: ROOT,
    stdio: 'inherit',
    env: { ...process.env, ...env },
  });
  if (result.status !== 0) {
    process.exit(result.status || 1);
  }
}

function rmrf(target) {
  if (fs.existsSync(target)) {
    fs.rmSync(target, { recursive: true, force: true });
  }
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(s, d);
    } else if (entry.isSymbolicLink()) {
      fs.symlinkSync(fs.readlinkSync(s), d);
    } else {
      fs.copyFileSync(s, d);
    }
  }
}

console.log('[itch] cleaning previous build outputs');
rmrf(OUT_DIR);
rmrf(ITCH_DIR);

console.log('[itch] building Next.js static export');
run('npx', ['next', 'build'], {
  // Force itch mode; clear anything that would override it.
  NEXT_PUBLIC_ASSET_PREFIX: '.',
  NEXT_PUBLIC_RELATIVE_NAV: '1',
  NEXT_PUBLIC_BASE_PATH: '',
  NEXT_PUBLIC_SITE_URL: '',
});

if (!fs.existsSync(OUT_DIR)) {
  console.error('[itch] build did not produce ./out');
  process.exit(1);
}

console.log('[itch] copying ./out -> ./itch-build');
copyDir(OUT_DIR, ITCH_DIR);

console.log(`[itch] packaging ./${ZIP_NAME} (contents of ./itch-build, no top-level folder)`);
rmrf(ZIP_PATH);
// `zip -r ../reasonable-doubt-itch.zip .` from inside itch-build keeps index.html
// at the archive root, which is what itch.io expects.
const zipResult = spawnSync('zip', ['-rq', ZIP_PATH, '.'], {
  cwd: ITCH_DIR,
  stdio: 'inherit',
});
if (zipResult.status !== 0) {
  console.error('[itch] failed to create zip archive (is `zip` installed?)');
  process.exit(zipResult.status || 1);
}

console.log('[itch] done.');
console.log(`       Upload ./${ZIP_NAME} to itch.io (index.html is at the archive root).`);
