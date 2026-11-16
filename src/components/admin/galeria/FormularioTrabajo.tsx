import FormAccion from "@/components/admin/formularios/FormAccion";
import BotonEnviar from "@/components/admin/formularios/BotonEnviar";
import Campo from "@/components/admin/formularios/Campo";
import Selector from "@/components/admin/formularios/Selector";
import { guardarTrabajo } from "@/app/admin/galeria/actions";
import type { Tables } from "@/lib/supabase/database.types";

export default function FormularioTrabajo({
  trabajo,
  productos,
}: {
  trabajo?: Tables<"trabajos">;
  productos: { id: string; nombre: string }[];
}) {
  return (
    <FormAccion accion={guardarTrabajo} className="grid gap-4 sm:grid-cols-2">
      {trabajo && <input type="hidden" name="id" value={trabajo.id} />}

      <Campo
        etiqueta="Título"
        name="titulo"
        defaultValue={trabajo?.titulo}
        placeholder="Ej.: Tazas para cumpleaños de Sofía"
        required
        maxLength={100}
        className="sm:col-span-2"
      />

      <label className="block text-sm font-semibold sm:col-span-2">
        Descripción
        <textarea
          name="descripcion"
          defaultValue={trabajo?.descripcion ?? ""}
          maxLength={1000}
          rows={4}
          placeholder="Qué se hizo, para quién, material, detalles..."
          className="mt-1 block w-full rounded-xl border border-borde bg-fondo px-3 py-2 text-base font-normal outline-none transition focus:border-primario focus:ring-4 focus:ring-primario/15"
        />
      </label>

      <Selector etiqueta="Producto" name="producto_id" defaultValue={trabajo?.producto_id ?? ""}>
        <option value="">Sin producto</option>
        {productos.map((p) => (
          <option key={p.id} value={p.id}>
            {p.nombre}
          </option>
        ))}
      </Selector>

      <Campo etiqueta="Fecha del trabajo (opcional)" name="fecha_trabajo" type="date" defaultValue={trabajo?.fecha_trabajo ?? ""} />

      <Campo
        etiqueta="Etiquetas (separadas por coma)"
        name="etiquetas"
        defaultValue={trabajo?.etiquetas.join(", ") ?? ""}
        placeholder="regalo, cumpleaños, fotos"
        className="sm:col-span-2"
      />

      <Campo
        etiqueta="Orden"
        name="orden"
        type="number"
        min={0}
        max={999}
        defaultValue={trabajo?.orden ?? 0}
        required
      />

      <div className="flex flex-wrap items-center gap-6">
        <label className="flex min-h-[44px] items-center gap-2 text-sm font-semibold">
          <input type="checkbox" name="publicado" defaultChecked={trabajo?.publicado ?? false} className="h-5 w-5 accent-primario" />
          Publicado
        </label>
        <label className="flex min-h-[44px] items-center gap-2 text-sm font-semibold">
          <input type="checkbox" name="destacado" defaultChecked={trabajo?.destacado ?? false} className="h-5 w-5 accent-primario" />
          Destacado
        </label>
      </div>

      <div className="sm:col-span-2 sm:text-right">
        <BotonEnviar>{trabajo ? "Guardar cambios" : "Crear y agregar fotos"}</BotonEnviar>
      </div>
    </FormAccion>
  );
}