import FormAccion from "@/components/admin/formularios/FormAccion";
import BotonEnviar from "@/components/admin/formularios/BotonEnviar";
import Campo from "@/components/admin/formularios/Campo";
import Selector from "@/components/admin/formularios/Selector";
import SubidaImagen from "@/components/admin/formularios/SubidaImagen";
import { guardarServicio } from "@/app/admin/servicios/actions";
import { ICONOS_SERVICIO } from "@/lib/iconos";
import type { Tables } from "@/lib/supabase/database.types";

export default function FormularioServicio({ servicio }: { servicio?: Tables<"servicios"> }) {
  return (
    <FormAccion accion={guardarServicio} className="grid gap-4 sm:grid-cols-2">
      {servicio && <input type="hidden" name="id" value={servicio.id} />}

      <Campo
        etiqueta="Título"
        name="titulo"
        defaultValue={servicio?.titulo}
        placeholder="Ej.: Diseño personalizado"
        required
        maxLength={80}
        className="sm:col-span-2"
      />

      <label className="block text-sm font-semibold sm:col-span-2">
        Descripción
        <textarea
          name="descripcion"
          defaultValue={servicio?.descripcion ?? ""}
          maxLength={600}
          rows={3}
          className="mt-1 block w-full rounded-xl border border-borde bg-fondo px-3 py-2 text-base font-normal outline-none transition focus:border-primario focus:ring-4 focus:ring-primario/15"
        />
      </label>

      <Selector etiqueta="Icono" name="icono" defaultValue={servicio?.icono ?? ""}>
        <option value="">Sin icono</option>
        {Object.entries(ICONOS_SERVICIO).map(([clave, { etiqueta }]) => (
          <option key={clave} value={clave}>
            {etiqueta}
          </option>
        ))}
      </Selector>

      <Campo
        etiqueta="Precio “desde” (USD, opcional)"
        name="precio_desde"
        type="text"
        inputMode="decimal"
        defaultValue={servicio?.precio_desde != null ? Number(servicio.precio_desde).toFixed(2) : ""}
      />

      <Campo
        etiqueta="Orden en el sitio"
        name="orden"
        type="number"
        min={0}
        max={999}
        defaultValue={servicio?.orden ?? 0}
        required
      />

      <label className="flex min-h-[44px] items-center gap-2 text-sm font-semibold">
        <input
          type="checkbox"
          name="activo"
          defaultChecked={servicio?.activo ?? true}
          className="h-5 w-5 accent-primario"
        />
        Visible en el sitio
      </label>

      <div className="sm:col-span-2">
        <SubidaImagen
          carpeta="servicios"
          rutaActual={servicio?.imagen_ruta ?? null}
          etiqueta="Imagen (opcional)"
        />
      </div>

      <div className="sm:col-span-2 sm:text-right">
        <BotonEnviar>{servicio ? "Guardar cambios" : "Crear servicio"}</BotonEnviar>
      </div>
    </FormAccion>
  );
}