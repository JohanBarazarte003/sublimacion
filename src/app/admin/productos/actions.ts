"use server";

import { revalidatePath } from "next/cache";
import { exigirAdmin } from "@/lib/auth/admin";
import {
  convertirError,
  exito,
  fallo,
  falloBase,
  type Estado,
} from "@/lib/admin/respuesta";
import {
  leerBool,
  leerDecimal,
  leerEntero,
  leerTexto,
  leerTextoOpcional,
  leerUuid,
} from "@/lib/validacion/campos";

// Refresca el panel y también el sitio público (precios visibles, catálogo...)
const refrescar = () => revalidatePath("/", "layout");

export async function publicarPrecios(_estado: Estado, datos: FormData): Promise<Estado> {
  const { supabase } = await exigirAdmin();
  try {
    const publicar = leerBool(datos, "publicar");
    const { error } = await supabase
      .from("ajustes")
      .upsert({ clave: "mostrar_precios", valor: publicar, publico: true }, { onConflict: "clave" });
    if (error) return falloBase(error);

    refrescar();
    return exito(publicar ? "Los precios ya son públicos." : "Los precios están ocultos.");
  } catch (e) {
    return convertirError(e);
  }
}

export async function guardarProducto(_estado: Estado, datos: FormData): Promise<Estado> {
  const { supabase } = await exigirAdmin();
  try {
    const id = leerUuid(datos);
    const nombre = leerTexto(datos, "nombre", "el nombre", 80);
    const descripcion = leerTextoOpcional(datos, "descripcion", "la descripción", 500);
    const orden = leerEntero(datos, "orden", "el orden", 0, 999);
    const activo = leerBool(datos, "activo");

    const { data, error } = await supabase
      .from("productos")
      .update({ nombre, descripcion, orden, activo })
      .eq("id", id)
      .select("id");
    if (error) return falloBase(error);
    if (!data?.length) return fallo("No se encontró el producto.");

    refrescar();
    return exito("Producto guardado.");
  } catch (e) {
    return convertirError(e);
  }
}

export async function crearVariante(_estado: Estado, datos: FormData): Promise<Estado> {
  const { supabase } = await exigirAdmin();
  try {
    const productoId = leerUuid(datos, "producto_id");
    const nombre = leerTexto(datos, "nombre", "el nombre de la variante", 80);
    const material = leerTextoOpcional(datos, "material", "el material", 60);

    const { error } = await supabase
      .from("variantes")
      .insert({ producto_id: productoId, nombre, material });
    if (error) return falloBase(error);

    refrescar();
    return exito("Variante creada.");
  } catch (e) {
    return convertirError(e);
  }
}

export async function guardarVariante(_estado: Estado, datos: FormData): Promise<Estado> {
  const { supabase } = await exigirAdmin();
  try {
    const id = leerUuid(datos);
    const nombre = leerTexto(datos, "nombre", "el nombre", 80);
    const material = leerTextoOpcional(datos, "material", "el material", 60);
    const orden = leerEntero(datos, "orden", "el orden", 0, 999);
    const activo = leerBool(datos, "activo");

    const { data, error } = await supabase
      .from("variantes")
      .update({ nombre, material, orden, activo })
      .eq("id", id)
      .select("id");
    if (error) return falloBase(error);
    if (!data?.length) return fallo("No se encontró la variante.");

    refrescar();
    return exito("Variante guardada.");
  } catch (e) {
    return convertirError(e);
  }
}

// Sirve para agregar un tramo nuevo y para corregir el precio de uno existente
export async function guardarPrecio(_estado: Estado, datos: FormData): Promise<Estado> {
  const { supabase } = await exigirAdmin();
  try {
    const varianteId = leerUuid(datos, "variante_id");
    const cantidadMin = leerEntero(datos, "cantidad_min", "la cantidad mínima", 1, 100000);
    const precio = leerDecimal(datos, "precio", "el precio", 0, 100000);

    const { error } = await supabase.from("precios").upsert(
      { variante_id: varianteId, cantidad_min: cantidadMin, precio_unitario: precio },
      { onConflict: "variante_id,cantidad_min" }
    );
    if (error) return falloBase(error);

    refrescar();
    return exito("Precio guardado.");
  } catch (e) {
    return convertirError(e);
  }
}

export async function eliminarPrecio(_estado: Estado, datos: FormData): Promise<Estado> {
  const { supabase } = await exigirAdmin();
  try {
    const id = leerUuid(datos);
    const { error } = await supabase.from("precios").delete().eq("id", id);
    if (error) return falloBase(error);

    refrescar();
    return exito("Precio eliminado.");
  } catch (e) {
    return convertirError(e);
  }
}