import { ErrorValidacion } from "@/lib/validacion/campos";

// "id" cambia en cada respuesta; el formulario lo usa para reiniciarse al guardar con éxito
export type Estado = { ok: boolean; mensaje: string; id: number } | null;

export const exito = (mensaje: string): Estado => ({ ok: true, mensaje, id: Date.now() });
export const fallo = (mensaje: string): Estado => ({ ok: false, mensaje, id: Date.now() });

// Los errores de validación se muestran tal cual; los demás se registran y se muestran en genérico
export function convertirError(e: unknown): Estado {
  if (e instanceof ErrorValidacion) return fallo(e.message);
  console.error(e);
  return fallo("Ocurrió un error inesperado. Intenta de nuevo.");
}

export function falloBase(error: { message: string }): Estado {
  console.error("Error de base de datos:", error.message);
  return fallo("No se pudo guardar. Intenta de nuevo.");
}