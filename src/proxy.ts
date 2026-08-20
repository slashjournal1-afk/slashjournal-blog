import { type NextRequest } from 'next/server';
import { createClient } from '@/utils/supabase/middleware';

export default async function proxy(request: NextRequest) {
  const { response } = createClient(request);
  return response;
}

export const config = {
  matcher: ['/auth/callback'],
};
