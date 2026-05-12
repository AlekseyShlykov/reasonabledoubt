/**
 * Navigation helper that supports both client-side routing (default) and
 * relative `*.html` navigation for static hosts that serve the build under
 * an unknown deep path (e.g. itch.io HTML5 export at /html/<id>/).
 *
 * Enable relative mode at build time with NEXT_PUBLIC_RELATIVE_NAV=1.
 */
import type { useRouter } from 'next/navigation';

type Router = ReturnType<typeof useRouter>;

export type AppRoute = '/' | '/intro' | '/cases' | '/results' | '/admin';

const ROUTE_TO_FILE: Record<AppRoute, string> = {
  '/': 'index.html',
  '/intro': 'intro.html',
  '/cases': 'cases.html',
  '/results': 'results.html',
  '/admin': 'admin.html',
};

function isRelativeNav(): boolean {
  return process.env.NEXT_PUBLIC_RELATIVE_NAV === '1';
}

export function navigateTo(router: Router, route: AppRoute): void {
  if (isRelativeNav()) {
    if (typeof window !== 'undefined') {
      window.location.href = ROUTE_TO_FILE[route];
    }
    return;
  }
  router.push(route);
}
