import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./database.types";

// Cliente para el navegador: usa la sesión del admin (RLS y políticas de Storage aplican)
export function crearClienteNavegador() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}