// Las fechas del panel se escriben y muestran en hora de Caracas (UTC-4, sin horario de verano)

export function aInputCaracas(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso)
    .toLocaleString("sv-SE", { timeZone: "America/Caracas" })
    .replace(" ", "T")
    .slice(0, 16);
}

export function formatearCaracas(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleString("es-VE", {
    timeZone: "America/Caracas",
    dateStyle: "medium",
    timeStyle: "short",
  });
}