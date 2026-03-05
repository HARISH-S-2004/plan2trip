import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://xuxqiagcyytqoshyutyr.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_-Cn8kNkuAeAQS_zKQkZ8Gg_Crd9zkE9"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
