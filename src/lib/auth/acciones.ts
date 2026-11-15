"use server";

import { redirect } from "next/navigation";
import { crearClienteServidor } from "@/lib/supabase/servidor";

export async function iniciarSesion(formData: FormData) {
  const correo = String(formData.get("correo") ?? "").trim();
  const clave = String(formData.get("clave") ?? "");

  if (!correo || !clave || correo.length > 254 || clave.length > 200) {
    redirect("/login?error=datos");
  }

  const supabase = await crearClienteServidor();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: correo,
    password: clave,
  });

  // Mensaje genérico: no revela si el correo existe
  if (error || !data.user) redirect("/login?error=credenciales");

  const { data: perfil } = await supabase
    .from("perfiles")
    .select("rol")
    .eq("id", data.user.id)
    .maybeSingle();

  // Quien no sea admin no conserva ninguna sesión
  if (perfil?.rol !== "admin") {
    await supabase.auth.signOut();
    redirect("/login?error=permiso");
  }

  redirect("/admin");
}

export async function cerrarSesion() {
  const supabase = await crearClienteServidor();
  await supabase.auth.signOut();
  redirect("/login");
}