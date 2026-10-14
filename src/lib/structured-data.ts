import { absoluteUrl, siteConfig } from '@/lib/site';

export const organizationId = absoluteUrl('/#organization');
export const websiteId = absoluteUrl('/#website');
export const authorId = absoluteUrl('/about#author');

// sameAs terkonfirmasi milik penulis (Okt 2026). Satu sumber: siteConfig.
export const authorSameAs: string[] = [...siteConfig.authorSameAs];

export function breadcrumbSchema(items: Array<{ name: string; path: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function siteGraphSchema() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': organizationId,
        name: siteConfig.name,
        url: siteConfig.url,
        logo: {
          '@type': 'ImageObject',
          url: absoluteUrl('/icon/Minimalist_SJ_monogram_logo_design_202608201741.png'),
          width: 547,
          height: 547,
        },
      },
      {
        '@type': 'WebSite',
        '@id': websiteId,
        name: siteConfig.name,
        url: siteConfig.url,
        description: siteConfig.description,
        inLanguage: siteConfig.locale,
        publisher: { '@id': organizationId },
        potentialAction: {
          '@type': 'SearchAction',
          target: `${absoluteUrl('/search')}?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'Person',
        '@id': authorId,
        name: siteConfig.authorName,
        url: absoluteUrl('/about#author'),
        image: absoluteUrl('/choirul-humam.webp'),
        jobTitle: siteConfig.authorJobTitle,
        description:
          'Choirul Humam adalah penulis dan Software Engineer di balik SlashJournal — publikasi independen tentang arsitektur sistem dan rekayasa perangkat lunak.',
        worksFor: { '@id': organizationId },
        sameAs: authorSameAs,
      },
    ],
  };
}
