// Root Layout for Next.js App Router
// NOTE: suppressHydrationWarning is required to prevent server-side crashes
// that cause 500 errors on webpack.js, main.js, react-refresh.js, _app.js, _error.js
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Script from 'next/script';
import '@/styles/globals.css';

const GA_MEASUREMENT_ID = 'G-1VL1RR3W2F';

/** Same rules as `next.config.js` so OG/Twitter absolute URLs match GitHub Pages / subpath deploys. */
function publicBasePath(): string {
  let base = (process.env.NEXT_PUBLIC_BASE_PATH || '').trim().replace(/\/$/, '');
  if (base && !base.startsWith('/')) base = `/${base}`;
  return base && base !== '/' ? base : '';
}

/**
 * Canonical site root for metadata (no trailing slash before URL()).
 * Set in CI/production, e.g. `https://yourname.github.io` + `NEXT_PUBLIC_BASE_PATH=/Verdict`.
 */
function metadataBaseUrl(): URL {
  const origin = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');
  const base = publicBasePath();
  const joined = `${origin}${base}`;
  return new URL(joined.endsWith('/') ? joined : `${joined}/`);
}

const OG_TITLE = 'Reasonable Doubt';
const OG_DESCRIPTION =
  'A narrative game about AI predictions, community verdicts, and the weight of reasonable doubt.';

/** Absolute URL so OG/Twitter work with `basePath` (e.g. GitHub Project Pages). */
function absoluteOgImageUrl(): string {
  const origin = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');
  const base = publicBasePath();
  const path = base ? `${base}/og-preview.png` : '/og-preview.png';
  return `${origin}${path}`;
}

export const metadata: Metadata = {
  metadataBase: metadataBaseUrl(),
  title: OG_TITLE,
  description: OG_DESCRIPTION,
  openGraph: {
    title: OG_TITLE,
    description: OG_DESCRIPTION,
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: absoluteOgImageUrl(),
        width: 1024,
        height: 576,
        alt: 'Reasonable Doubt — title screen with Start',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: OG_TITLE,
    description: OG_DESCRIPTION,
    images: [absoluteOgImageUrl()],
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover' as const,
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
      </body>
    </html>
  );
}
