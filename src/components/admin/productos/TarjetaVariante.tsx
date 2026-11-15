import FormAccion from "@/components/admin/formularios/FormAccion";
import BotonEnviar from "@/components/admin/formularios/BotonEnviar";
import Campo from "@/components/admin/formularios/Campo";
import {
  eliminarPrecio,
  guardarPrecio,
  guardarVariante,
} from "@/app/admin/productos/actions";
import type { Tables } from "@/lib/supabase/database.types";

export default function TarjetaVariante({
  variante,
  precios,
}: {
  variante: Tables<"variantes">;
  precios: Tables<"precios">[];
}) {
  const tienePrecioUnitario = precios.some((p) => p.cantidad_min === 1);

  return (
    <section className="rounded-tarjeta border border-borde bg-fondo p-5 shadow-tarjeta">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-lg font-bold">{variante.nombre}</h3>
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${
            variante.activo ? "bg-exito/15 text-exito" : "bg-borde text-texto-suave"
          }`}
        >
          {variante.activo ? "Activa" : "Inactiva"}
        </span>
      </div>

      <FormAccion
        accion={guardarVariante}
        className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_6rem_auto_auto] sm:items-end"
      >
        <input type="hidden" name="id" value={variante.id} />
        <Campo etiqueta="Nombre" name="nombre" defaultValue={variante.nombre} required maxLength={80} />
        <Campo etiqueta="Material" name="material" defaultValue={variante.material ?? ""} maxLength={60} />
        <Campo
          etiqueta="Orden"
          name="orden"
          type="number"
          min={0}
          max={999}
          defaultValue={variante.orden}
          required
        />
        <label className="flex min-h-[44px] items-center gap-2 text-sm font-semibold">
          <input
            type="checkbox"
            name="activo"
            defaultChecked={variante.activo}
            className="h-5 w-5 accent-primario"
          />
          Activa
        </label>
        <BotonEnviar>Guardar</BotonEnviar>
      </FormAccion>

      <div className="mt-6 border-t border-borde pt-5">
        <h4 className="text-sm font-bold uppercase tracking-wider text-texto-suave">
          Precios por cantidad (USD)
        </h4>
        <p className="mt-1 text-xs text-texto-suave">
          Cada fila aplica desde esa cantidad en adelante. Ejemplo: 1 unidad a un
          precio, y desde 12 unidades a un precio menor.
        </p>

        {!tienePrecioUnitario && (
          <p className="mt-2 text-xs font-medium text-error">
            Falta el precio para 1 unidad. Sin él, los pedidos pequeños se mostrarán
            como “Cotizar”.
          </p>
        )}

        {precios.length > 0 && (
          <ul className="mt-3 divide-y divide-borde">
            {precios.map((p) => (
              <li key={p.id} className="flex flex-wrap items-end gap-3 py-3">
                <p className="w-32 pb-3 text-sm font-semibold">
                  Desde {p.cantidad_min} {p.cantidad_min === 1 ? "unidad" : "unidades"}
                </p>

                <FormAccion accion={guardarPrecio} className="flex flex-wrap items-end gap-2">
                  <input type="hidden" name="variante_id" value={variante.id} />
                  <input type="hidden" name="cantidad_min" value={p.cantidad_min} />
                  <Campo
                    etiqueta="Precio unitario"
                    name="precio"
                    type="text"
                    inputMode="decimal"
                    defaultValue={p.precio_unitario.toFixed(2)}
                    required
                    className="w-36"
                  />
                  <BotonEnviar>Guardar</BotonEnviar>
                </FormAccion>

                <FormAccion accion={eliminarPrecio}>
                  <input type="hidden" name="id" value={p.id} />
                  <BotonEnviar variante="peligro" textoPendiente="Quitando…">
                    Quitar
                  </BotonEnviar>
                </FormAccion>
              </li>
            ))}
          </ul>
        )}

        <FormAccion
          accion={guardarPrecio}
          className="mt-3 flex flex-wrap items-end gap-3 rounded-2xl bg-superficie p-3"
        >
          <input type="hidden" name="variante_id" value={variante.id} />
          <Campo
            etiqueta="Desde (unidades)"
            name="cantidad_min"
            type="number"
            min={1}
            max={100000}
            required
            className="w-40"
          />
          <Campo
            etiqueta="Precio unitario (USD)"
            name="precio"
            type="text"
            inputMode="decimal"
            placeholder="0.00"
            required
            className="w-44"
          />
          <BotonEnviar>Agregar precio</BotonEnviar>
        </FormAccion>
      </div>
    </section>
  );
}