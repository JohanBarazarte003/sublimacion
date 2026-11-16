import type { Metadata } from "next";
import Image from "next/image";
import { exigirAdmin } from "@/lib/auth/admin";
import { ICONOS_SERVICIO } from "@/lib/iconos";
import { urlPublica } from "@/lib/supabase/almacenamiento";
import FormAccion from "@/components/admin/formularios/FormAccion";
import BotonEnviar from "@/components/admin/formularios/BotonEnviar";
import FormularioServicio from "@/components/admin/servicios/FormularioServicio";
import { eliminarServicio } from "./actions";

export const metadata: Metadata = { title: "Servicios" };

export default async function Servicios() {
  const { supabase } = await exigirAdmin();

  const { data, error } = await supabase
    .from("servicios")
    .select("*")
    .order("orden")
    .order("titulo");

  if (error) {
    return (
      <p role="alert" className="text-sm font-medium text-error">
        No se pudieron cargar los servicios. Revisa los permisos de la base.
      </p>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-extrabold">Servicios</h1>
      <p className="mt-1 text-sm text-texto-suave">
        Lo que ofreces además de los productos. Aparecen en la página de Servicios del sitio.
      </p>

      <section className="mt-6 rounded-tarjeta border border-borde bg-fondo p-5 shadow-tarjeta">
        <h2 className="text-lg font-bold">Nuevo servicio</h2>
        <div className="mt-4">
          <FormularioServicio />
        </div>
      </section>

      <h2 className="mt-10 text-xl font-extrabold">Servicios creados</h2>

      {data.length === 0 ? (
        <p className="mt-3 text-sm text-texto-suave">Aún no hay servicios.</p>
      ) : (
        <ul className="mt-4 flex flex-col gap-4">
          {data.map((s) => {
            const url = urlPublica(s.imagen_ruta);
            const Icono = s.icono ? ICONOS_SERVICIO[s.icono]?.Icono : undefined;

            return (
              <li key={s.id} className="rounded-tarjeta border border-borde bg-fondo p-5 shadow-tarjeta">
                <div className="flex items-start gap-4">
                  {url ? (
                    <Image
                      src={url}
                      alt=""
                      width={64}
                      height={64}
                      unoptimized
                      className="h-16 w-16 shrink-0 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="grid h-16 w-16 shrink-0 place-items-center rounded-xl bg-superficie text-primario">
                      {Icono ? <Icono size={26} /> : null}
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-lg font-bold">{s.titulo}</h3>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          s.activo ? "bg-exito/15 text-exito" : "bg-borde text-texto-suave"
                        }`}
                      >
                        {s.activo ? "Visible" : "Oculto"}
                      </span>
                    </div>
                    {s.descripcion && (
                      <p className="mt-1 line-clamp-2 text-sm text-texto-suave">{s.descripcion}</p>
                    )}
                    <p className="mt-1 text-xs text-texto-suave">
                      Orden {s.orden}
                      {s.precio_desde != null && ` · desde ${Number(s.precio_desde).toFixed(2)} USD`}
                    </p>
                  </div>
                </div>

                <details className="mt-4 border-t border-borde pt-4">
                  <summary className="cursor-pointer text-sm font-semibold text-primario">Editar</summary>
                  <div className="mt-4">
                    <FormularioServicio servicio={s} />
                  </div>
                  <FormAccion
                    accion={eliminarServicio}
                    confirmar="¿Eliminar este servicio y su imagen? No se puede deshacer."
                    className="mt-4"
                  >
                    <input type="hidden" name="id" value={s.id} />
                    <BotonEnviar variante="peligro" textoPendiente="Eliminando…">
                      Eliminar servicio
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