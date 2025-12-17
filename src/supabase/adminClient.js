import { createClient } from "@supabase/supabase-js";

// Cliente admin de Supabase con Service Role Key
// NOTA: En una aplicación real, esto debería estar en el backend
// Para desarrollo, usamos la clave anon con permisos elevados temporalmente
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseServiceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY; // Agregamos VITE_ temporalmente

// Fallback a la clave anon si no está disponible la service role
const supabaseKey =
  supabaseServiceRoleKey || import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseKey) {
  throw new Error("No se encontró ninguna clave de Supabase válida");
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
