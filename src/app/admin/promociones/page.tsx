import type { Metadata } from "next";
import { exigirAdmin } from "@/lib/auth/admin";
import { formatearCaracas } from "@/lib/fechas";
import FormAccion from "@/components/admin/formularios/FormAccion";
import BotonEnviar from "@/components/admin/formularios/BotonEnviar";
import FormularioPromocion from "@/components/admin/promociones/FormularioPromocion";
import type { Tables } from "@/lib/supabase/database.types";
import { eliminarPromocion } from "./actions";

export const metadata: Metadata = { title: "Promociones" };

function estadoPromocion(p: Tables<"promociones">) {
  const ahora = Date.now();
  if (!p.activa) return { texto: "Inactiva", estilo: "bg-borde text-texto-suave" };
  if (p.inicia_en && new Date(p.inicia_en).getTime() > ahora) {
    return { texto: "Programada", estilo: "bg-acento/40 text-tinta" };
  }
  if (p.termina_en && new Date(p.termina_en).getTime() < ahora) {
    return { texto: "Vencida", estilo: "bg-error/10 text-error" };
  }
  return { texto: "Vigente", estilo: "bg-exito/15 text-exito" };
}

export default async function Promociones() {
  const { supabase } = await exigirAdmin();

  const [promos, productos, variantes] = await Promise.all([
    supabase.from("promociones").select("*").order("creado_en", { ascending: false }),
    supabase.from("productos").select("id, nombre").order("orden"),
    supabase.from("variantes").select("id, nombre, producto_id").order("nombre"),
  ]);

  if (promos.error || productos.error || variantes.error) {
    return (
      <p role="alert" className="text-sm font-medium text-error">
        No se pudieron cargar las promociones. Revisa los permisos de la base.
      </p>
    );
  }

  const nombreProducto = new Map(productos.data.map((p) => [p.id, p.nombre]));
  const nombreVariante = new Map(variantes.data.map((v) => [v.id, v.nombre]));

  const opciones = [
    { valor: "global", etiqueta: "Todos los productos" },
    ...productos.data.map((p) => ({ valor: `producto:${p.id}`, etiqueta: `Producto: ${p.nombre}` })),
    ...variantes.data.map((v) => ({
      valor: `variante:${v.id}`,
      etiqueta: `Variante: ${nombreProducto.get(v.producto_id) ?? ""} › ${v.nombre}`,
    })),
  ];

  const textoAlcance = (p: Tables<"promociones">) => {
    if (p.variante_id) return `Variante: ${nombreVariante.get(p.variante_id) ?? "—"}`;
    if (p.producto_id) return `Producto: ${nombreProducto.get(p.producto_id) ?? "—"}`;
    return "Todos los productos";
  };

  const textoDescuento = (p: Tables<"promociones">) =>
    p.tipo === "porcentaje" ? `${p.valor}% de descuento` : `${Number(p.valor).toFixed(2)} USD menos por unidad`;

  return (
    <>
      <h1 className="text-2xl font-extrabold">Promociones</h1>

      <section className="mt-4 rounded-tarjeta border border-borde bg-fondo p-5 text-sm shadow-tarjeta">
        <h2 className="font-bold">Cómo se aplican</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-texto-suave">
          <li>No se acumulan: a cada producto se le aplica la promoción que más descuenta por unidad.</li>
          <li>Solo cuentan las activas, dentro de sus fechas y con la cantidad mínima cumplida.</li>
          <li>Los visitantes las ven únicamente si los precios están publicados.</li>
        </ul>
      </section>

      <section className="mt-6 rounded-tarjeta border border-borde bg-fondo p-5 shadow-tarjeta">
        <h2 className="text-lg font-bold">Nueva promoción</h2>
        <div className="mt-4">
          <FormularioPromocion opciones={opciones} />
        </div>
      </section>

      <h2 className="mt-10 text-xl font-extrabold">Promociones creadas</h2>

      {promos.data.length === 0 ? (
        <p className="mt-3 text-sm text-texto-suave">Aún no hay promociones.</p>
      ) : (
        <ul className="mt-4 flex flex-col gap-4">
          {promos.data.map((p) => {
            const estado = estadoPromocion(p);
            return (
              <li key={p.id} className="rounded-tarjeta border border-borde bg-fondo p-5 shadow-tarjeta">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold">{p.nombre}</h3>
                    <p className="text-sm text-texto-suave">
                      {textoDescuento(p)} · desde {p.cantidad_min}{" "}
                      {p.cantidad_min === 1 ? "unidad" : "unidades"} · {textoAlcance(p)}
                    </p>
                    {(p.inicia_en || p.termina_en) && (
                      <p className="text-xs text-texto-suave">
                        {p.inicia_en ? formatearCaracas(p.inicia_en) : "Sin inicio"} →{" "}
                        {p.termina_en ? formatearCaracas(p.termina_en) : "Sin fin"}
                      </p>
                    )}
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${estado.estilo}`}>
                    {estado.texto}
                  </span>
                </div>

                <details className="mt-4 border-t border-borde pt-4">
                  <summary className="cursor-pointer text-sm font-semibold text-primario">
                    Editar
                  </summary>
                  <div className="mt-4">
                    <FormularioPromocion promocion={p} opciones={opciones} />
                  </div>
                  <FormAccion
                    accion={eliminarPromocion}
                    confirmar="¿Eliminar esta promoción? No se puede deshacer."
                    className="mt-4"
                  >
                    <input type="hidden" name="id" value={p.id} />
                    <BotonEnviar variante="peligro" textoPendiente="Eliminando…">
                      Eliminar promoción
                    </BotonEnviar>
                  </FormAccion>
                </details>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}