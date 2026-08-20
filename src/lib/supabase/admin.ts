import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Supabase Admin Client using SERVICE_ROLE_KEY for server-only background tasks
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qhuieagivaxcccyrnwwc.supabase.co';
  const supabaseServiceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    'sb_publishable_NtbPdFRHUPFk99hDGxf2ZQ_hnGq_uxl';

  return createSupabaseClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
