import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { Inter, Newsreader, JetBrains_Mono } from 'next/font/google';
import '@/styles/globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { TopProgressBar } from '@/components/layout/TopProgressBar';
import { CommandPalette } from '@/components/search/CommandPalette';

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
  description:
    'Publikasi editorial tentang arsitektur sistem, rekayasa software terdistribusi, dan keputusan teknis yang layak dipahami.',
  keywords: [
    'System Design',
    'Software Architecture',
    'PostgreSQL',
    'Next.js',
    'Microservices',
    'Distributed Systems',
  ],
  authors: [{ name: 'Choirul Arsitek' }],
  metadataBase: new URL('http://localhost:3000'),
  openGraph: {
    title: 'SlashJournal — Catatan Arsitektur & Rekayasa Perangkat Lunak',
    description:
      'Publikasi editorial tentang arsitektur sistem dan rekayasa software terstruktur.',
    type: 'website',
    images: ['/api/og'],
  },
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
        <ThemeProvider>
          <AuthProvider>
            <Suspense fallback={null}>
              <TopProgressBar />
            </Suspense>
            <div className="flex-1 flex flex-col">{children}</div>
            <CommandPalette />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}