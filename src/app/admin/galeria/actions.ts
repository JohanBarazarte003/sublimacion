"use server";

import type { SupabaseClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { exigirAdmin } from "@/lib/auth/admin";
import { convertirError, exito, fallo, falloBase, type Estado } from "@/lib/admin/respuesta";
import { BUCKET_PUBLICO } from "@/lib/supabase/almacenamiento";
import type { Database } from "@/lib/supabase/database.types";
import { slugificar } from "@/lib/texto";
import {
  ErrorValidacion,
  PATRON_UUID,
  leerBool,
  leerEntero,
  leerTexto,
  leerTextoOpcional,
  leerUuid,
} from "@/lib/validacion/campos";

const MAX_IMAGENES = 6;
const refrescar = () => revalidatePath("/", "layout");

async function slugUnico(supabase: SupabaseClient<Database>, titulo: string) {
  const base = slugificar(titulo) || "trabajo";
  for (let i = 1; i <= 20; i++) {
    const candidato = i === 1 ? base : `${base}-${i}`;
    const { data } = await supabase.from("trabajos").select("id").eq("slug", candidato).maybeSingle();
    if (!data) return candidato;
  }
  throw new ErrorValidacion("Ya hay demasiados trabajos con un título parecido. Cambia el título.");
}

function leerEtiquetas(f: FormData): string[] {
  const lista = String(f.get("etiquetas") ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  if (lista.length > 8) throw new ErrorValidacion("Máximo 8 etiquetas.");
  if (lista.some((t) => t.length > 30)) throw new ErrorValidacion("Cada etiqueta admite hasta 30 caracteres.");
  return [...new Set(lista)];
}

function leerFecha(f: FormData): string | null {
  const bruto = String(f.get("fecha_trabajo") ?? "").trim();
  if (!bruto) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(bruto)) throw new ErrorValidacion("Revisa la fecha del trabajo.");
  return bruto;
}

function leerProductoOpcional(f: FormData): string | null {
  const bruto = String(f.get("producto_id") ?? "");
  if (!bruto) return null;
  if (!PATRON_UUID.test(bruto)) throw new ErrorValidacion("Elige un producto de la lista.");
  return bruto;
}

// Crea el trabajo (y abre su página de fotos), o lo actualiza si trae "id"
export async function guardarTrabajo(_estado: Estado, datos: FormData): Promise<Estado> {
  const { supabase } = await exigirAdmin();
  let nuevoId: string | null = null;

  try {
    const id = String(datos.get("id") ?? "") ? leerUuid(datos) : null;

    const campos = {
      titulo: leerTexto(datos, "titulo", "el título", 100),
      descripcion: leerTextoOpcional(datos, "descripcion", "la descripción", 1000),
      producto_id: leerProductoOpcional(datos),
      etiquetas: leerEtiquetas(datos),
      fecha_trabajo: leerFecha(datos),
      orden: leerEntero(datos, "orden", "el orden", 0, 999),
      destacado: leerBool(datos, "destacado"),
      publicado: leerBool(datos, "publicado"),
    };

    if (id) {
      const { data, error } = await supabase.from("trabajos").update(campos).eq("id", id).select("id");
      if (error) return falloBase(error);
      if (!data?.length) return fallo("No se encontró el trabajo.");
      refrescar();
      return exito("Trabajo guardado.");
    }

    const slug = await slugUnico(supabase, campos.titulo);
    const { data, error } = await supabase.from("trabajos").insert({ ...campos, slug }).select("id").single();
    if (error) return falloBase(error);
    nuevoId = data.id;
    refrescar();
  } catch (e) {
    return convertirError(e);
  }

  // redirect lanza una excepción interna: va fuera del try
  redirect(`/admin/galeria/${nuevoId}`);
}

export async function eliminarTrabajo(_estado: Estado, datos: FormData): Promise<Estado> {
  const { supabase } = await exigirAdmin();
  try {
    const id = leerUuid(datos);
    const { data: imagenes } = await supabase.from("trabajo_imagenes").select("ruta").eq("trabajo_id", id);

    const { error } = await supabase.from("trabajos").delete().eq("id", id);
    if (error) return falloBase(error);

    if (imagenes?.length) {
      await supabase.storage.from(BUCKET_PUBLICO).remove(imagenes.map((i) => i.ruta));
    }
    refrescar();
  } catch (e) {
    return convertirError(e);
  }
  redirect("/admin/galeria");
}

// La llama el navegador después de subir cada archivo a Storage
export async function registrarImagen(
  trabajoId: string,
  ruta: string,
  ancho: number,
  alto: number
): Promise<Estado> {
  const { supabase } = await exigirAdmin();
  try {
    if (!PATRON_UUID.test(trabajoId)) throw new ErrorValidacion("Solicitud no válida.");
    const patron = new RegExp(`^galeria/${trabajoId}/[0-9a-f-]{36}\\.(webp|png|jpg)$`, "i");
    if (!patron.test(ruta)) throw new ErrorValidacion("La imagen no es válida.");
    if (!Number.isInteger(ancho) || !Number.isInteger(alto) || ancho < 1 || alto < 1 || ancho > 10000 || alto > 10000) {
      throw new ErrorValidacion("Medidas de imagen no válidas.");
    }

    const { data: trabajo } = await supabase.from("trabajos").select("titulo").eq("id", trabajoId).maybeSingle();
    if (!trabajo) return fallo("No se encontró el trabajo.");

    const { count } = await supabase
      .from("trabajo_imagenes")
      .select("id", { count: "exact", head: true })
      .eq("trabajo_id", trabajoId);
    if ((count ?? 0) >= MAX_IMAGENES) return fallo(`Máximo ${MAX_IMAGENES} fotos por trabajo.`);

    const { error } = await supabase.from("trabajo_imagenes").insert({
      trabajo_id: trabajoId,
      ruta,
      alt: trabajo.titulo,
      ancho,
      alto,
      orden: count ?? 0,
      es_portada: (count ?? 0) === 0, // la primera foto es la portada
    });
    if (error) return falloBase(error);

    refrescar();
    return exito("Foto agregada.");
  } catch (e) {
    return convertirError(e);
  }
}

export async function definirPortada(_estado: Estado, datos: FormData): Promise<Estado> {
  const { supabase } = await exigirAdmin();
  try {
    const id = leerUuid(datos);
    const { data: imagen } = await supabase.from("trabajo_imagenes").select("trabajo_id").eq("id", id).maybeSingle();
    if (!imagen) return fallo("No se encontró la foto.");

    // Primero se quita la portada actual (solo puede haber una por trabajo)
    const quitar = await supabase.from("trabajo_imagenes").update({ es_portada: false }).eq("trabajo_id", imagen.trabajo_id);
    if (quitar.error) return falloBase(quitar.error);
    const poner = await supabase.from("trabajo_imagenes").update({ es_portada: true }).eq("id", id);
    if (poner.error) return falloBase(poner.error);

    refrescar();
    return exito("Portada actualizada.");
  } catch (e) {
    return convertirError(e);
  }
}

export async function eliminarImagen(_estado: Estado, datos: FormData): Promise<Estado> {
  const { supabase } = await exigirAdmin();
  try {
    const id = leerUuid(datos);
    const { data: imagen } = await supabase
      .from("trabajo_imagenes")
      .select("trabajo_id, ruta, es_portada")
      .eq("id", id)
      .maybeSingle();
    if (!imagen) return fallo("No se encontró la foto.");

    const { error } = await supabase.from("trabajo_imagenes").delete().eq("id", id);
    if (error) return falloBase(error);
    await supabase.storage.from(BUCKET_PUBLICO).remove([imagen.ruta]);

    // Si era la portada, otra foto toma su lugar
    if (imagen.es_portada) {
      const { data: otra } = await supabase
        .from("trabajo_imagenes")
        .select("id")
        .eq("trabajo_id", imagen.trabajo_id)
        .order("orden")
        .limit(1)
        .maybeSingle();
      if (otra) await supabase.from("trabajo_imagenes").update({ es_portada: true }).eq("id", otra.id);
    }

    refrescar();
    return exito("Foto eliminada.");
  } catch (e) {
    return convertirError(e);
  }
}