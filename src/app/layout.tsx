import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { Inter, Newsreader, JetBrains_Mono } from 'next/font/google';
import '@/styles/globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { TopProgressBar } from '@/components/layout/TopProgressBar';
import { CommandPalette } from '@/components/search/CommandPalette';
import { GoogleTagManager } from '@/components/analytics/GoogleTagManager';
import { GoogleConsent } from '@/components/analytics/GoogleConsent';
import { siteConfig } from '@/lib/site';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const newsreader = Newsreader({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'SlashJournal — Catatan Arsitektur & Rekayasa Perangkat Lunak',
    template: '%s — SlashJournal',
  },
  description: siteConfig.description,
  keywords: [
    'System Design',
    'Software Architecture',
    'PostgreSQL',
    'Next.js',
    'Microservices',
    'Distributed Systems',
  ],
  authors: [{ name: 'Choirul Arsitek', url: siteConfig.url }],
  metadataBase: new URL(siteConfig.url),
  icons: {
    icon: [
      { url: '/icon/Minimalist_SJ_monogram_logo_design_202608201741.svg', type: 'image/svg+xml' },
      { url: '/icon/favicon_io/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon/favicon_io/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icon/Minimalist_SJ_monogram_logo_design_202608201741.ico', sizes: 'any' },
    ],
    apple: [{ url: '/icon/favicon_io/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  manifest: '/manifest.webmanifest',
  verification: { google: siteConfig.verification },
  robots: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
  openGraph: {
    title: 'SlashJournal — Catatan Arsitektur & Rekayasa Perangkat Lunak',
    description:
      'Publikasi editorial tentang arsitektur sistem dan rekayasa software terstruktur.',
    type: 'website',
    url: siteConfig.url,
    locale: siteConfig.locale,
    siteName: siteConfig.name,
    images: [{ url: '/api/og', width: 1200, height: 630, alt: siteConfig.name }],
  },
  twitter: { card: 'summary_large_image', title: siteConfig.name, description: siteConfig.description, images: ['/api/og'] },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${newsreader.variable} ${jetbrainsMono.variable} min-h-screen flex flex-col antialiased bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors`}
      >
        <GoogleTagManager />
        <ThemeProvider>
          <AuthProvider>
            <Suspense fallback={null}>
              <TopProgressBar />
            </Suspense>
            <div className="flex-1 flex flex-col">{children}</div>
            <CommandPalette />
            <GoogleConsent />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
