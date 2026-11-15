import { exigirAdmin } from "@/lib/auth/admin";

export default async function Resumen() {
  // Cada página repite la verificación: un layout no se vuelve a ejecutar al navegar
  const { supabase } = await exigirAdmin();

  const [nuevas, productos, trabajos, servicios, precios] = await Promise.all([
    supabase.from("cotizaciones").select("id", { count: "exact", head: true }).eq("estado", "nueva"),
    supabase.from("productos").select("id", { count: "exact", head: true }),
    supabase.from("trabajos").select("id", { count: "exact", head: true }),
    supabase.from("servicios").select("id", { count: "exact", head: true }),
    supabase.from("ajustes").select("valor").eq("clave", "mostrar_precios").maybeSingle(),
  ]);

  const hayError = [nuevas, productos, trabajos, servicios, precios].some((r) => r.error);

  const tarjetas = [
    { titulo: "Cotizaciones nuevas", valor: String(nuevas.count ?? 0) },
    { titulo: "Productos (todos)", valor: String(productos.count ?? 0) },
    { titulo: "Trabajos en galería", valor: String(trabajos.count ?? 0) },
    { titulo: "Servicios", valor: String(servicios.count ?? 0) },
    { titulo: "Precios publicados", valor: precios.data?.valor === true ? "Sí" : "No" },
  ];

  return (
    <>
      <h1 className="text-2xl font-extrabold">Resumen</h1>

      {hayError && (
        <p role="alert" className="mt-4 text-sm font-medium text-error">
          No se pudo leer algún dato. Revisa los permisos de la base.
        </p>
      )}

      <ul className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {tarjetas.map((t) => (
          <li key={t.titulo} className="rounded-tarjeta border border-borde bg-fondo p-5 shadow-tarjeta">
            <p className="text-sm text-texto-suave">{t.titulo}</p>
            <p className="mt-2 text-3xl font-extrabold">{t.valor}</p>
          </li>
        ))}
      </ul>
    </>
  );
}