import { createClient as createServerSupabaseClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';
import { setSessionCookie } from '@/lib/auth';
import { UserRole } from '@/lib/types';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '/';

  if (code) {
    try {
      const supabase = await createServerSupabaseClient();
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (!error && data.user) {
        const authUser = data.user;
        const email = authUser.email || '';
        const name =
          authUser.user_metadata?.full_name ||
          authUser.user_metadata?.name ||
          email.split('@')[0] ||
          'Pengguna';
        const avatarUrl =
          authUser.user_metadata?.avatar_url ||
          authUser.user_metadata?.picture ||
          null;
        const provider =
          authUser.app_metadata?.provider?.toUpperCase() || 'GOOGLE';

        // Upsert user into database
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

        // Set application secure cookie
        await setSessionCookie(dbUser.id, dbUser.role as UserRole);
      }
    } catch (err) {
      console.error('Error exchanging OAuth code for session:', err);
    }
  }

  return NextResponse.redirect(new URL(next, requestUrl.origin));
}
