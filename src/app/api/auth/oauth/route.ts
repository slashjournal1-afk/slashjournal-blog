import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isValidInternalPath } from '@/lib/api-errors';

const SUPPORTED_PROVIDERS = new Set(['google', 'github', 'twitter']);

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const provider = requestUrl.searchParams.get('provider')?.toLowerCase() || '';
  const next = requestUrl.searchParams.get('next') || '/';

  if (!SUPPORTED_PROVIDERS.has(provider)) {
    return NextResponse.json({ error: 'OAuth provider tidak didukung' }, { status: 400 });
  }
  if (!isValidInternalPath(next)) {
    return NextResponse.json({ error: 'Tujuan redirect tidak valid' }, { status: 400 });
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider as 'google' | 'github' | 'twitter',
      options: { redirectTo: `${requestUrl.origin}/auth/callback?next=${encodeURIComponent(next)}` },
    });

    if (error || !data.url) {
      console.error('OAuth initialization failed:', error);
      return NextResponse.json({ error: 'Login OAuth tidak tersedia' }, { status: 503 });
    }

    return NextResponse.redirect(data.url);
  } catch (error) {
    console.error('OAuth route failed:', error);
    return NextResponse.json({ error: 'Login OAuth tidak tersedia' }, { status: 503 });
  }
}
