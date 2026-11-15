import type { Metadata } from "next";
import Link from "next/link";
import { exigirAdmin } from "@/lib/auth/admin";
import FormAccion from "@/components/admin/formularios/FormAccion";
import BotonEnviar from "@/components/admin/formularios/BotonEnviar";
import { publicarPrecios } from "./actions";

export const metadata: Metadata = { title: "Productos y precios" };

const TIPOS: Record<string, string> = {
  cilindro_3d: "Visor 3D cilíndrico",
  plano_2d: "Visor 2D plano",
};

export default async function Productos() {
  const { supabase } = await exigirAdmin();

  const [productos, variantes, precios, ajuste] = await Promise.all([
    supabase.from("productos").select("id, nombre, tipo_visor, activo, orden").order("orden"),
    supabase.from("variantes").select("id, producto_id, activo"),
    supabase.from("precios").select("variante_id"),
    supabase.from("ajustes").select("valor").eq("clave", "mostrar_precios").maybeSingle(),
  ]);

  if (productos.error || variantes.error || precios.error) {
    return (
      <p role="alert" className="text-sm font-medium text-error">
        No se pudieron cargar los productos. Revisa los permisos de la base.
      </p>
    );
  }

  const conPrecio = new Set(precios.data.map((p) => p.variante_id));
  const publicados = ajuste.data?.valor === true;

  const resumen = productos.data.map((p) => {
    const activas = variantes.data.filter((v) => v.producto_id === p.id && v.activo);
    return { ...p, activas: activas.length, sinPrecio: activas.filter((v) => !conPrecio.has(v.id)).length };
  });
  const totalSinPrecio = resumen.reduce((t, p) => (p.activo ? t + p.sinPrecio : t), 0);

  return (
    <>
      <h1 className="text-2xl font-extrabold">Productos y precios</h1>
      <p className="mt-1 text-sm text-texto-suave">Todos los precios están en USD.</p>

      <section className="mt-6 rounded-tarjeta border border-borde bg-fondo p-5 shadow-tarjeta">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-bold">Precios en el sitio</h2>
            <p className="mt-1 text-sm text-texto-suave">
              Ahora mismo están{" "}
              <strong className={publicados ? "text-exito" : "text-error"}>
                {publicados ? "publicados" : "ocultos"}
              </strong>
              . Lo que no tenga precio se muestra como “Cotizar”.
            </p>
          </div>

          <FormAccion accion={publicarPrecios}>
            <input type="hidden" name="publicar" value={publicados ? "false" : "true"} />
            <BotonEnviar variante={publicados ? "suave" : "primario"}>
              {publicados ? "Ocultar precios" : "Publicar precios"}
            </BotonEnviar>
          </FormAccion>
        </div>

        {totalSinPrecio > 0 && (
          <p className="mt-3 text-sm font-medium text-error">
            Hay {totalSinPrecio} variante{totalSinPrecio === 1 ? "" : "s"} activa
            {totalSinPrecio === 1 ? "" : "s"} sin ningún precio cargado.
          </p>
        )}
      </section>

      <ul className="mt-6 grid gap-4 md:grid-cols-2">
        {resumen.map((p) => (
          <li key={p.id} className="rounded-tarjeta border border-borde bg-fondo p-5 shadow-tarjeta">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold">{p.nombre}</h3>
                <p className="text-xs text-texto-suave">{TIPOS[p.tipo_visor] ?? p.tipo_visor}</p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  p.activo ? "bg-exito/15 text-exito" : "bg-borde text-texto-suave"
                }`}
              >
                {p.activo ? "Visible" : "Oculto"}
              </span>
            </div>

            <p className="mt-3 text-sm text-texto-suave">
              {p.activas} variante{p.activas === 1 ? "" : "s"} activa{p.activas === 1 ? "" : "s"}
              {p.sinPrecio > 0 && (
                <span className="font-medium text-error"> · {p.sinPrecio} sin precio</span>
              )}
            </p>

            <Link
              href={`/admin/productos/${p.id}`}
              className="mt-4 inline-flex min-h-[44px] items-center rounded-full border border-borde px-5 text-sm font-semibold transition hover:bg-superficie"
            >
              Gestionar
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}