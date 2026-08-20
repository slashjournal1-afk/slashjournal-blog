import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://qhuieagivaxcccyrnwwc.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_NtbPdFRHUPFk99hDGxf2ZQ_hnGq_uxl";

export const createClient = () =>
  createBrowserClient(
    supabaseUrl,
    supabaseKey,
  );
