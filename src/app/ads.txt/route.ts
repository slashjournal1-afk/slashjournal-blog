import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export function GET() {
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID || '';
  const accountId = publisherId.replace(/^ca-/, '');
  if (!accountId) return new NextResponse('', { status: 204 });
  return new NextResponse(`google.com, ${accountId}, DIRECT, f08c47fec0942fa0\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  });
}
