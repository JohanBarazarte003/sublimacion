"use server";

import type { SupabaseClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { exigirAdmin } from "@/lib/auth/admin";
import { convertirError, exito, fallo, falloBase, type Estado } from "@/lib/admin/respuesta";
import { ICONOS_SERVICIO } from "@/lib/iconos";
import { BUCKET_PUBLICO } from "@/lib/supabase/almacenamiento";
import type { Database } from "@/lib/supabase/database.types";
import { slugificar } from "@/lib/texto";
import {
  ErrorValidacion,
  leerBool,
  leerDecimal,
  leerEntero,
  leerRutaImagenOpcional,
  leerTexto,
  leerTextoOpcional,
  leerUuid,
} from "@/lib/validacion/campos";

const CARPETA = "servicios";
const refrescar = () => revalidatePath("/", "layout");

// La dirección (slug) se genera del título y no cambia al editar, para no romper enlaces
async function slugUnico(supabase: SupabaseClient<Database>, titulo: string) {
  const base = slugificar(titulo) || "servicio";
  for (let i = 1; i <= 20; i++) {
    const candidato = i === 1 ? base : `${base}-${i}`;
    const { data } = await supabase.from("servicios").select("id").eq("slug", candidato).maybeSingle();
    if (!data) return candidato;
  }
  throw new ErrorValidacion("Ya hay demasiados servicios con un título parecido. Cambia el título.");
}

// Crea el servicio, o lo actualiza si el formulario trae un "id"
export async function guardarServicio(_estado: Estado, datos: FormData): Promise<Estado> {
  const { supabase } = await exigirAdmin();
  try {
    const id = String(datos.get("id") ?? "") ? leerUuid(datos) : null;

    const titulo = leerTexto(datos, "titulo", "el título", 80);
    const descripcion = leerTextoOpcional(datos, "descripcion", "la descripción", 600);

    const icono = String(datos.get("icono") ?? "");
    if (icono && !(icono in ICONOS_SERVICIO)) {
      throw new ErrorValidacion("Elige un icono de la lista.");
    }

    const precioBruto = String(datos.get("precio_desde") ?? "").trim();
    const precioDesde = precioBruto
      ? leerDecimal(datos, "precio_desde", "el precio “desde”", 0, 100000)
      : null;

    const orden = leerEntero(datos, "orden", "el orden", 0, 999);
    const imagenRuta = leerRutaImagenOpcional(datos, "imagen_ruta", CARPETA);

    const campos = {
      titulo,
      descripcion,
      icono: icono || null,
      precio_desde: precioDesde,
      orden,
      activo: leerBool(datos, "activo"),
      imagen_ruta: imagenRuta,
    };

    if (id) {
      const { data: previo } = await supabase
        .from("servicios")
        .select("imagen_ruta")
        .eq("id", id)
        .maybeSingle();
      if (!previo) return fallo("No se encontró el servicio.");

      const { error } = await supabase.from("servicios").update(campos).eq("id", id);
      if (error) return falloBase(error);

      // Si la imagen cambió o se quitó, se borra el archivo anterior
      if (previo.imagen_ruta && previo.imagen_ruta !== imagenRuta) {
        await supabase.storage.from(BUCKET_PUBLICO).remove([previo.imagen_ruta]);
      }

      refrescar();
      return exito("Servicio guardado.");
    }

    const slug = await slugUnico(supabase, titulo);
    const { error } = await supabase.from("servicios").insert({ ...campos, slug });
    if (error) return falloBase(error);

    refrescar();
    return exito("Servicio creado.");
  } catch (e) {
    return convertirError(e);
  }
}

export async function eliminarServicio(_estado: Estado, datos: FormData): Promise<Estado> {
  const { supabase } = await exigirAdmin();
  try {
    const id = leerUuid(datos);

    const { data: previo } = await supabase
      .from("servicios")
      .select("imagen_ruta")
      .eq("id", id)
      .maybeSingle();

    const { error } = await supabase.from("servicios").delete().eq("id", id);
    if (error) return falloBase(error);

    if (previo?.imagen_ruta) {
      await supabase.storage.from(BUCKET_PUBLICO).remove([previo.imagen_ruta]);
    }

    refrescar();
    return exito("Servicio eliminado.");
  } catch (e) {
    return convertirError(e);
  }
}