import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/dashboard/', '/api/', '/auth/', '/bookmarks', '/search'],
      },
      { userAgent: ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'PerplexityBot'], allow: '/' },
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
    host: new URL(absoluteUrl()).host,
  };
}
