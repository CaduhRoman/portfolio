/**
 * Configuração do Supabase
 *
 * Para desenvolvimento local, crie um arquivo .env na raiz com:
 * VITE_SUPABASE_URL=sua_url
 * VITE_SUPABASE_ANON_KEY=sua_chave_anon
 *
 * Se não estiver usando Vite/bundler, edite diretamente os valores abaixo.
 */

// Detecta se está usando variáveis de ambiente (Vite/bundler) ou valores hardcoded
const SUPABASE_URL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL)
    || 'https://SEU_PROJETO.supabase.co';

const SUPABASE_ANON_KEY = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY)
    || 'SUA_CHAVE_ANON_AQUI';
VITE_SUPABASE_URL
export const supabaseConfig = {
    url: SUPABASE_URL,
    anonKey: SUPABASE_ANON_KEY
};