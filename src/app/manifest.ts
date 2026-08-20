import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'SlashJournal',
    short_name: 'SlashJournal',
    description: 'Catatan arsitektur dan rekayasa perangkat lunak.',
    start_url: '/',
    display: 'browser',
    background_color: '#f7f6f3',
    theme_color: '#09090b',
    icons: [
      { src: '/icon/favicon_io/android-chrome-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
      { src: '/icon/favicon_io/android-chrome-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      { src: '/icon/Minimalist_SJ_monogram_logo_design_202608201741.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
    ],
  };
}
