/** @type {import('next').NextConfig} */
let base = (process.env.NEXT_PUBLIC_BASE_PATH || '').trim().replace(/\/$/, '');
if (base && !base.startsWith('/')) base = `/${base}`;
const basePath = base && base !== '/' ? base : '';

const nextConfig = {
  reactStrictMode: true,
  /** Static export for GitHub Pages (output in `out/`). */
  output: 'export',
  images: {
    unoptimized: true,
  },
  ...(basePath ? { basePath } : {}),
};

module.exports = nextConfig;
