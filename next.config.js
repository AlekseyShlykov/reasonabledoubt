/** @type {import('next').NextConfig} */
let base = (process.env.NEXT_PUBLIC_BASE_PATH || '').trim().replace(/\/$/, '');
if (base && !base.startsWith('/')) base = `/${base}`;
const basePath = base && base !== '/' ? base : '';

// Optional relative asset prefix for builds hosted at an unknown deep path
// (e.g. itch.io HTML5 export served at /html/<id>/...).
// Set `NEXT_PUBLIC_ASSET_PREFIX=.` to make all `_next/` URLs relative.
const rawAssetPrefix = (process.env.NEXT_PUBLIC_ASSET_PREFIX || '').trim().replace(/\/$/, '');
const assetPrefix = rawAssetPrefix || '';

const nextConfig = {
  reactStrictMode: true,
  /** Static export for GitHub Pages (output in `out/`). */
  output: 'export',
  images: {
    unoptimized: true,
  },
  ...(assetPrefix ? { assetPrefix } : basePath ? { basePath } : {}),
};

module.exports = nextConfig;
