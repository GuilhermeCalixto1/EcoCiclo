import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

export const isSupabaseConfigured = () => {
  return Boolean(
    supabaseUrl &&
    supabaseKey &&
    !supabaseUrl.includes('seu-projeto') &&
    !supabaseKey.includes('sua-chave')
  );
};

export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : null;

if (!isSupabaseConfigured()) {
  console.warn(
    '\x1b[33m%s\x1b[0m',
    '⚠️ [Supabase] Credenciais não configuradas no backend/.env. O servidor usará dados em memória para testes locais.'
  );
} else {
  console.log(
    '\x1b[32m%s\x1b[0m',
    '✅ [Supabase] Cliente conectado com sucesso a: ' + supabaseUrl
  );
}
