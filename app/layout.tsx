import type { Metadata, Viewport } from 'next';
import { Outfit } from 'next/font/google';
import ServiceWorker from '@/components/ServiceWorker';
import './globals.css';

// next/font downloads Outfit at build time and serves it from our own origin,
// so the app has no runtime dependency on Google Fonts.
const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400'],
  display: 'swap',
  variable: '--font-outfit',
});

export const metadata: Metadata = {
  title: 'Streaks',
  description: "Today's habits, one tap to complete.",
  manifest: '/manifest.webmanifest',
  applicationName: 'Streaks',
  appleWebApp: { capable: true, title: 'Streaks', statusBarStyle: 'default' },
  icons: {
    icon: [
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/icons/apple-touch-icon.png', sizes: '180x180' }],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fcfcfb' },
    { media: '(prefers-color-scheme: dark)', color: '#131412' },
  ],
  // Lets the layout paint under the notch so env(safe-area-inset-*) is meaningful.
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={outfit.variable}>
      <body>
        {children}
        <ServiceWorker />
      </body>
    </html>
  );
}
