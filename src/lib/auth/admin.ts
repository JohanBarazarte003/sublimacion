import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { crearClienteServidor } from "@/lib/supabase/servidor";

// Llámala al inicio de CADA página o acción del panel.
// Devuelve un cliente con la sesión del admin: el RLS se aplica con su identidad.
export const exigirAdmin = cache(async () => {
  const supabase = await crearClienteServidor();

  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (!claims) redirect("/login");

  const { data: perfil } = await supabase
    .from("perfiles")
    .select("rol")
    .eq("id", claims.sub)
    .maybeSingle();

  if (perfil?.rol !== "admin") redirect("/login?error=permiso");

  const email = (claims as { email?: string }).email ?? "";
  return { supabase, userId: claims.sub, email };
});