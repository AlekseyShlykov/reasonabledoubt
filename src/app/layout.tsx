// Root Layout for Next.js App Router
// NOTE: suppressHydrationWarning is required to prevent server-side crashes
// that cause 500 errors on webpack.js, main.js, react-refresh.js, _app.js, _error.js
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Script from 'next/script';
import '@/styles/globals.css';

const GA_MEASUREMENT_ID = 'G-1VL1RR3W2F';

export const metadata: Metadata = {
  title: 'Reasonable Doubt',
  description: 'A narrative game about AI predictions and human judgment',
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
