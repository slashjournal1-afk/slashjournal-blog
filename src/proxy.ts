import { type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/middleware';

export default async function proxy(request: NextRequest) {
  // Hanya untuk OAuth callback — slug 404 ditangani di generateMetadata([slug])
  // via notFound() agar proxy tidak query DB di setiap request (hemat Active CPU
  // + mengecilkan bundle middleware karena tidak lagi membawa Prisma).
  const { response } = createClient(request);
  return response;
}

export const config = {
  matcher: ['/auth/callback/:path*'],
};
