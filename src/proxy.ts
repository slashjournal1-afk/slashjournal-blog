import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/middleware';
import { prisma } from '@/lib/db';
import { publicArticleWhere } from '@/lib/visibility';

// First-level paths owned by real routes/assets — never treated as article slugs.
// Dotted names (og-image.jpeg, sitemap.xml, verification files) are excluded by the dot rule.
const RESERVED_SLUG_PATTERN =
  /^(api|_next|uploads|icon|img|auth|search|series|category|tag|glossary|bookmarks|about|contact|privacy-policy|terms|cookie-policy|login|register|forgot-password|reset-password|dashboard|admin|feed\.xml|llms\.txt|robots\.txt|sitemap\.xml|manifest\.webmanifest|not-found-shell)$/i;

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Keep the Supabase session-refresh behaviour scoped to the OAuth callback,
  // matching the previous dedicated matcher.
  if (pathname.startsWith('/auth/callback')) {
    const { response } = createClient(request);
    return response;
  }

  // Single-segment URLs are candidates for /article-[slug], which renders as a
  // streamed response — once streaming starts the status code is locked to 200
  // and notFound() can only emit a noindex soft-404. Resolve existence here so
  // missing slugs get a branded page with a real HTTP 404 before any body flush.
  const segments = pathname.split('/').filter(Boolean);
  const isSlugCandidate =
    request.method === 'GET' &&
    segments.length === 1 &&
    !pathname.endsWith('/') &&
    !segments[0].includes('.') &&
    !RESERVED_SLUG_PATTERN.test(segments[0]);

  if (isSlugCandidate) {
    try {
      const exists = await prisma.article.findFirst({
        where: { slug: segments[0], ...publicArticleWhere },
        select: { id: true },
      });
      if (!exists) {
        return NextResponse.rewrite(new URL('/not-found-shell', request.url));
      }
    } catch {
      // Database hiccup: fall through to normal rendering (streamed noindex fallback).
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
