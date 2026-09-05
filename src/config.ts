const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? "https://SEU_PROJETO.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? "SUA_CHAVE_ANON_AQUI";

export const supabaseConfig = {
  url: supabaseUrl,
  anonKey: supabaseAnonKey,
};
