import FormAccion from "@/components/admin/formularios/FormAccion";
import BotonEnviar from "@/components/admin/formularios/BotonEnviar";
import Campo from "@/components/admin/formularios/Campo";
import Selector from "@/components/admin/formularios/Selector";
import { guardarPromocion } from "@/app/admin/promociones/actions";
import { aInputCaracas } from "@/lib/fechas";
import type { Tables } from "@/lib/supabase/database.types";

export type OpcionAlcance = { valor: string; etiqueta: string };

function alcanceActual(p?: Tables<"promociones">) {
  if (p?.variante_id) return `variante:${p.variante_id}`;
  if (p?.producto_id) return `producto:${p.producto_id}`;
  return "global";
}

export default function FormularioPromocion({
  promocion,
  opciones,
}: {
  promocion?: Tables<"promociones">;
  opciones: OpcionAlcance[];
}) {
  return (
    <FormAccion accion={guardarPromocion} className="grid gap-4 sm:grid-cols-2">
      {promocion && <input type="hidden" name="id" value={promocion.id} />}

      <Campo
        etiqueta="Nombre"
        name="nombre"
        defaultValue={promocion?.nombre}
        placeholder="Ej.: 10% por docena"
        required
        maxLength={80}
        className="sm:col-span-2"
      />

      <Selector etiqueta="Tipo de descuento" name="tipo" defaultValue={promocion?.tipo ?? "porcentaje"}>
        <option value="porcentaje">Porcentaje (%)</option>
        <option value="monto_fijo_unitario">Monto fijo menos por unidad (USD)</option>
      </Selector>

      <Campo
        etiqueta="Valor"
        name="valor"
        type="text"
        inputMode="decimal"
        defaultValue={promocion ? String(promocion.valor) : ""}
        placeholder="10"
        required
      />

      <Selector etiqueta="Aplica a" name="alcance" defaultValue={alcanceActual(promocion)}>
        {opciones.map((o) => (
          <option key={o.valor} value={o.valor}>
            {o.etiqueta}
          </option>
        ))}
      </Selector>

      <Campo
        etiqueta="Desde (unidades)"
        name="cantidad_min"
        type="number"
        min={1}
        max={100000}
        defaultValue={promocion?.cantidad_min ?? 1}
        required
      />

      <Campo
        etiqueta="Inicia (hora de Caracas)"
        name="inicia_en"
        type="datetime-local"
        defaultValue={aInputCaracas(promocion?.inicia_en ?? null)}
      />
      <Campo
        etiqueta="Termina (hora de Caracas)"
        name="termina_en"
        type="datetime-local"
        defaultValue={aInputCaracas(promocion?.termina_en ?? null)}
      />

      <label className="block text-sm font-semibold sm:col-span-2">
        Descripción (opcional)
        <textarea
          name="descripcion"
          defaultValue={promocion?.descripcion ?? ""}
          maxLength={300}
          rows={2}
          className="mt-1 block w-full rounded-xl border border-borde bg-fondo px-3 py-2 text-base font-normal outline-none transition focus:border-primario focus:ring-4 focus:ring-primario/15"
        />
      </label>

      <label className="flex min-h-[44px] items-center gap-2 text-sm font-semibold">
        <input
          type="checkbox"
          name="activa"
          defaultChecked={promocion?.activa ?? true}
          className="h-5 w-5 accent-primario"
        />
        Activa
      </label>

      <div className="sm:text-right">
        <BotonEnviar>{promocion ? "Guardar cambios" : "Crear promoción"}</BotonEnviar>
      </div>
    </FormAccion>
  );
}