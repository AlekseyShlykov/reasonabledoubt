// Root Layout for Next.js App Router
// NOTE: suppressHydrationWarning is required to prevent server-side crashes
// that cause 500 errors on webpack.js, main.js, react-refresh.js, _app.js, _error.js
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Script from 'next/script';
import '@/styles/globals.css';

const GA_MEASUREMENT_ID = 'G-1VL1RR3W2F';
const FB_PIXEL_ID = '4281871595291721';

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
  const path = base ? `${base}/previewreasonable.png` : '/previewreasonable.png';
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
        width: 1200,
        height: 675,
        alt: 'Reasonable Doubt — title screen with Guilty and Not Guilty buttons',
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
        <Script id="facebook-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${FB_PIXEL_ID}');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          {/* Facebook Pixel fallback; next/image is not applicable here */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt=""
            height={1}
            width={1}
            style={{ display: 'none' }}
            src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
          />
        </noscript>
      </body>
    </html>
  );
}
