import FormAccion from "@/components/admin/formularios/FormAccion";
import BotonEnviar from "@/components/admin/formularios/BotonEnviar";
import Campo from "@/components/admin/formularios/Campo";
import { guardarProducto } from "@/app/admin/productos/actions";
import type { Tables } from "@/lib/supabase/database.types";

export default function FormularioProducto({ producto }: { producto: Tables<"productos"> }) {
  return (
    <FormAccion accion={guardarProducto} className="grid gap-4 sm:grid-cols-2">
      <input type="hidden" name="id" value={producto.id} />
      <Campo etiqueta="Nombre" name="nombre" defaultValue={producto.nombre} required maxLength={80} />
      <Campo
        etiqueta="Orden en el sitio"
        name="orden"
        type="number"
        min={0}
        max={999}
        defaultValue={producto.orden}
        required
      />

      <label className="block text-sm font-semibold sm:col-span-2">
        Descripción
        <textarea
          name="descripcion"
          defaultValue={producto.descripcion ?? ""}
          maxLength={500}
          rows={3}
          className="mt-1 block w-full rounded-xl border border-borde bg-fondo px-3 py-2 text-base font-normal outline-none transition focus:border-primario focus:ring-4 focus:ring-primario/15"
        />
      </label>

      <label className="flex min-h-[44px] items-center gap-2 text-sm font-semibold">
        <input
          type="checkbox"
          name="activo"
          defaultChecked={producto.activo}
          className="h-5 w-5 accent-primario"
        />
        Visible en el sitio
      </label>

      <div className="sm:text-right">
        <BotonEnviar>Guardar producto</BotonEnviar>
      </div>
    </FormAccion>
  );
}