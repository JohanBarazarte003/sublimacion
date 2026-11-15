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

const PATRON_UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function leerUuid(f: FormData, campo = "id"): string {
  const valor = String(f.get(campo) ?? "");
  if (!PATRON_UUID.test(valor)) {
    throw new ErrorValidacion("Solicitud no válida. Recarga la página.");
  }
  return valor;
}

export const leerBool = (f: FormData, campo: string) =>
  ["on", "true"].includes(String(f.get(campo) ?? ""));