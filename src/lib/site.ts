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
} as const;

export function absoluteUrl(path = '/') {
  return new URL(path, siteConfig.url).toString();
}
