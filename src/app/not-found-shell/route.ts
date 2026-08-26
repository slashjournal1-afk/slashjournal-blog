import { buildNotFoundHtml } from './html';

// Internal route consumed by src/proxy.ts rewrites so unknown article slugs
// get a real HTTP 404 with branded markup before any body streaming starts.
export function GET() {
  return new Response(buildNotFoundHtml(), {
    status: 404,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex',
    },
  });
}
