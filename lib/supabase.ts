import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://syftgzszmxtlnukvhdub.supabase.co';
// Use Service Role Key if available on server-side to bypass RLS, fallback to Anon Key otherwise
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 
                    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
                    'sb_publishable_tv707YP5H0eLFvHGCfRW3g_qlkwdGFF';

export const supabase = createClient(supabaseUrl, supabaseKey);
export default supabase;
