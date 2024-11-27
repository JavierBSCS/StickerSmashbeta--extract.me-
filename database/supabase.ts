import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://btjwlzwjeoqkmobrdafg.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0andsendqZW9xa21vYnJkYWZnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY0ODc3OTM5NCwiZXhwIjoxOTY0MzU1Mzk0fQ.uDsC4vdMorAMxlO_DdPJujBj8yrxylQWH74UBODlZ5w";

export const supabase: any = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
