export const siteConfig = {
  name: 'SlashJournal',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.slashjournal.my.id',
  locale: 'id-ID',
  language: 'id',
  description:
    'Publikasi editorial tentang arsitektur sistem, rekayasa software terdistribusi, dan keputusan teknis yang layak dipahami.',
  verification: 'hgnxdMdZ-ABTF2D0y-P8zzzJfqN4bfGQF9iOvVcNNxY',
  gtmId: 'GTM-MJ3ZRDFF',
  gaId: 'G-PXBK7BGP5Z',
  // Identitas penulis — satu sumber untuk Person schema (sameAs),
  // tautan eksplisit rel="me" di /about + footer, dan byline rel="author".
  // Kepemilikan terkonfirmasi oleh pemilik situs (Okt 2026).
  operatorName: 'Choirul Humam',
  authorName: 'Choirul Humam',
  authorUrl: '/about#author',
  authorJobTitle: 'Software Engineer & Technical Writer',
  authorSocials: [
    { label: 'Threads', handle: '@choyrulh', href: 'https://www.threads.com/@choyrulh' },
    { label: 'Instagram', handle: '@choyrulh', href: 'https://www.instagram.com/choyrulh/' },
    { label: 'X', handle: '@choyrulh7', href: 'https://x.com/choyrulh7' },
  ],
  authorSameAs: [
    'https://www.threads.com/@choyrulh',
    'https://www.instagram.com/choyrulh/',
    'https://x.com/choyrulh7',
  ],
  operatorType: 'Publikasi independen perorangan',
  operatorLocation: 'Pati, Jawa Tengah, Indonesia',
  contactEmail: 'halo@slashjournal.my.id',
  privacyEmail: 'privacy@slashjournal.my.id',
  lastLegalUpdate: '24 September 2026',
} as const;

export function absoluteUrl(path = '/') {
  return new URL(path, siteConfig.url).toString();
}
