import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Supabase Admin Client using SERVICE_ROLE_KEY for server-only background tasks
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) throw new Error('Supabase admin environment variables are missing');

  return createSupabaseClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
