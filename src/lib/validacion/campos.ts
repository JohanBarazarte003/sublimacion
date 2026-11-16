export class ErrorValidacion extends Error {}

export function leerTexto(f: FormData, campo: string, etiqueta: string, max: number): string {
  const valor = String(f.get(campo) ?? "").trim();
  if (!valor) throw new ErrorValidacion(`Escribe ${etiqueta}.`);
  if (valor.length > max) {
    throw new ErrorValidacion(`Revisa ${etiqueta}: máximo ${max} caracteres.`);
  }
  return valor;
}

export function leerTextoOpcional(
  f: FormData,
  campo: string,
  etiqueta: string,
  max: number
): string | null {
  const valor = String(f.get(campo) ?? "").trim();
  if (!valor) return null;
  if (valor.length > max) {
    throw new ErrorValidacion(`Revisa ${etiqueta}: máximo ${max} caracteres.`);
  }
  return valor;
}

export function leerEntero(
  f: FormData,
  campo: string,
  etiqueta: string,
  min: number,
  max: number
): number {
  const bruto = String(f.get(campo) ?? "").trim();
  const n = Number(bruto);
  if (!bruto || !Number.isInteger(n) || n < min || n > max) {
    throw new ErrorValidacion(
      `Revisa ${etiqueta}: un número entero entre ${min} y ${max}.`
    );
  }
  return n;
}

// Acepta "5,5" o "5.50"; máximo 2 decimales
export function leerDecimal(
  f: FormData,
  campo: string,
  etiqueta: string,
  min: number,
  max: number
): number {
  const bruto = String(f.get(campo) ?? "").trim().replace(",", ".");
  if (!/^\d{1,9}(\.\d{1,2})?$/.test(bruto)) {
    throw new ErrorValidacion(
      `Escribe ${etiqueta} como número con hasta 2 decimales, por ejemplo 2.50.`
    );
  }
  const n = Number(bruto);
  if (n < min || n > max) {
    throw new ErrorValidacion(`Revisa ${etiqueta}: entre ${min} y ${max}.`);
  }
  return n;
}

export const PATRON_UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function leerUuid(f: FormData, campo = "id"): string {
  const valor = String(f.get(campo) ?? "");
  if (!PATRON_UUID.test(valor)) {
    throw new ErrorValidacion("Solicitud no válida. Recarga la página.");
  }
  return valor;
}

export const leerBool = (f: FormData, campo: string) =>
  ["on", "true"].includes(String(f.get(campo) ?? ""));


// Fecha y hora escritas en hora de Caracas; se guardan en UTC
export function leerFechaOpcional(f: FormData, campo: string, etiqueta: string): string | null {
  const bruto = String(f.get(campo) ?? "").trim();
  if (!bruto) return null;
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(bruto)) {
    throw new ErrorValidacion(`Revisa ${etiqueta}.`);
  }
  const fecha = new Date(`${bruto}:00-04:00`);
  if (Number.isNaN(fecha.getTime())) throw new ErrorValidacion(`Revisa ${etiqueta}.`);
  return fecha.toISOString();
}

// "global", "producto:<id>" o "variante:<id>"
export function leerAlcance(f: FormData): { producto_id: string | null; variante_id: string | null } {
  const bruto = String(f.get("alcance") ?? "global");
  if (bruto === "global") return { producto_id: null, variante_id: null };

  const [tipo, id] = bruto.split(":");
  if (!PATRON_UUID.test(id ?? "")) {
    throw new ErrorValidacion("Elige a qué se aplica la promoción.");
  }
  if (tipo === "producto") return { producto_id: id, variante_id: null };
  if (tipo === "variante") return { producto_id: null, variante_id: id };
  throw new ErrorValidacion("Elige a qué se aplica la promoción.");
}

// Ruta de una imagen ya subida: "<carpeta>/<uuid>.<ext>"
export function leerRutaImagenOpcional(
  f: FormData,
  campo: string,
  carpeta: string
): string | null {
  const bruto = String(f.get(campo) ?? "").trim();
  if (!bruto) return null;
  const patron = new RegExp(`^${carpeta}/[0-9a-f-]{36}\\.(webp|png|jpg)$`, "i");
  if (!patron.test(bruto)) {
    throw new ErrorValidacion("La imagen no es válida. Súbela de nuevo.");
  }
  return bruto;
}