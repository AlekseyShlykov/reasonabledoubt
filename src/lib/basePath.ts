/**
 * Prefix for static hosting under a subpath (GitHub Project Pages: /repo-name/).
 * Set at build time: NEXT_PUBLIC_BASE_PATH=/repo-name
 * Leave unset or empty for a site at the domain root (e.g. user.github.io from user.github.io repo).
 */
export function withPublicPath(path: string): string {
  const raw = typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_BASE_PATH || '' : '';
  const base = raw.replace(/\/$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  if (!base) return p;
  return `${base}${p}`;
}
