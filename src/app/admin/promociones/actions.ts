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
  ErrorValidacion,
  leerAlcance,
  leerBool,
  leerDecimal,
  leerEntero,
  leerFechaOpcional,
  leerTexto,
  leerTextoOpcional,
  leerUuid,
} from "@/lib/validacion/campos";

const refrescar = () => revalidatePath("/", "layout");

const TIPOS = ["porcentaje", "monto_fijo_unitario"];

// Crea la promoción, o la actualiza si el formulario trae un "id"
export async function guardarPromocion(_estado: Estado, datos: FormData): Promise<Estado> {
  const { supabase } = await exigirAdmin();
  try {
    const id = String(datos.get("id") ?? "") ? leerUuid(datos) : null;

    const nombre = leerTexto(datos, "nombre", "el nombre", 80);
    const descripcion = leerTextoOpcional(datos, "descripcion", "la descripción", 300);

    const tipo = String(datos.get("tipo") ?? "");
    if (!TIPOS.includes(tipo)) throw new ErrorValidacion("Elige el tipo de descuento.");

    const valor = leerDecimal(datos, "valor", "el valor", 0.01, 100000);
    if (tipo === "porcentaje" && valor > 100) {
      throw new ErrorValidacion("Un porcentaje no puede superar 100.");
    }

    const cantidadMin = leerEntero(datos, "cantidad_min", "la cantidad mínima", 1, 100000);
    const { producto_id, variante_id } = leerAlcance(datos);

    const iniciaEn = leerFechaOpcional(datos, "inicia_en", "la fecha de inicio");
    const terminaEn = leerFechaOpcional(datos, "termina_en", "la fecha de fin");
    if (iniciaEn && terminaEn && new Date(terminaEn) <= new Date(iniciaEn)) {
      throw new ErrorValidacion("La fecha de fin debe ser posterior a la de inicio.");
    }

    const fila = {
      nombre,
      descripcion,
      tipo,
      valor,
      producto_id,
      variante_id,
      cantidad_min: cantidadMin,
      inicia_en: iniciaEn,
      termina_en: terminaEn,
      activa: leerBool(datos, "activa"),
    };

    if (id) {
      const { data, error } = await supabase
        .from("promociones")
        .update(fila)
        .eq("id", id)
        .select("id");
      if (error) return falloBase(error);
      if (!data?.length) return fallo("No se encontró la promoción.");
      refrescar();
      return exito("Promoción guardada.");
    }

    const { error } = await supabase.from("promociones").insert(fila);
    if (error) return falloBase(error);
    refrescar();
    return exito("Promoción creada.");
  } catch (e) {
    return convertirError(e);
  }
}

export async function eliminarPromocion(_estado: Estado, datos: FormData): Promise<Estado> {
  const { supabase } = await exigirAdmin();
  try {
    const id = leerUuid(datos);
    const { error } = await supabase.from("promociones").delete().eq("id", id);
    if (error) return falloBase(error);
    refrescar();
    return exito("Promoción eliminada.");
  } catch (e) {
    return convertirError(e);
  }
}