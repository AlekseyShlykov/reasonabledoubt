// Root Layout for Next.js App Router
// NOTE: suppressHydrationWarning is required to prevent server-side crashes
// that cause 500 errors on webpack.js, main.js, react-refresh.js, _app.js, _error.js
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import '@/styles/globals.css';

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
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
