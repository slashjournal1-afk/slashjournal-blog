import { createClient as createServerSupabaseClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';
import { setSessionCookie } from '@/lib/auth';
import { UserRole } from '@/lib/types';
import { isValidInternalPath } from '@/lib/api-errors';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const requestedNext = requestUrl.searchParams.get('next') || '/';
  const next = isValidInternalPath(requestedNext) ? requestedNext : '/';
  const providerError = requestUrl.searchParams.get('error_description') || requestUrl.searchParams.get('error');

  if (providerError || !code) {
    if (providerError) console.error('OAuth provider rejected authorization:', providerError);
    return NextResponse.redirect(new URL('/?auth=oauth-error', requestUrl.origin));
  }

  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error || !data.user) {
      console.error('OAuth code exchange failed:', error);
      return NextResponse.redirect(new URL('/?auth=oauth-error', requestUrl.origin));
    }

    const authUser = data.user;
    const email = authUser.email?.trim().toLowerCase();
    if (!email || authUser.email_confirmed_at === null) {
      console.error('OAuth user has no verified email:', authUser.id);
      return NextResponse.redirect(new URL('/?auth=oauth-error', requestUrl.origin));
    }

    const name =
      authUser.user_metadata?.full_name ||
      authUser.user_metadata?.name ||
      email.split('@')[0] ||
      'Pengguna';
    const avatarUrl = authUser.user_metadata?.avatar_url || authUser.user_metadata?.picture || null;
    const provider = authUser.app_metadata?.provider?.toUpperCase() || 'OAUTH';

    const dbUser = await prisma.user.upsert({
      where: { email },
      update: {
        name,
        displayName: name,
        avatarUrl: avatarUrl || undefined,
        provider,
        providerId: authUser.id,
      },
      create: {
        email,
        name,
        displayName: name,
        avatarUrl,
        provider,
        providerId: authUser.id,
        role: 'READER',
      },
    });

    await setSessionCookie(dbUser.id, dbUser.role as UserRole);
    return NextResponse.redirect(new URL(next, requestUrl.origin));
  } catch (error) {
    console.error('Error exchanging OAuth code for session:', error);
    return NextResponse.redirect(new URL('/?auth=oauth-error', requestUrl.origin));
  }
}
