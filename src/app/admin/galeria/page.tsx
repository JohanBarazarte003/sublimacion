import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { exigirAdmin } from "@/lib/auth/admin";
import { urlPublica } from "@/lib/supabase/almacenamiento";
import FormularioTrabajo from "@/components/admin/galeria/FormularioTrabajo";

export const metadata: Metadata = { title: "Galería" };

export default async function GaleriaAdmin() {
  const { supabase } = await exigirAdmin();

  const [trabajos, productos] = await Promise.all([
    supabase
      .from("trabajos")
      .select("id, titulo, publicado, destacado, orden, trabajo_imagenes(ruta, es_portada)")
      .order("orden")
      .order("creado_en", { ascending: false }),
    supabase.from("productos").select("id, nombre").order("orden"),
  ]);

  if (trabajos.error || productos.error) {
    return (
      <p role="alert" className="text-sm font-medium text-error">
        No se pudo cargar la galería. Revisa los permisos de la base.
      </p>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-extrabold">Galería</h1>
      <p className="mt-1 text-sm text-texto-suave">Los trabajos que ya realizaste. Solo se ven en el sitio los publicados.</p>

      <section className="mt-6 rounded-tarjeta border border-borde bg-fondo p-5 shadow-tarjeta">
        <h2 className="text-lg font-bold">Nuevo trabajo</h2>
        <div className="mt-4">
          <FormularioTrabajo productos={productos.data} />
        </div>
      </section>

      <h2 className="mt-10 text-xl font-extrabold">Trabajos</h2>
      {trabajos.data.length === 0 ? (
        <p className="mt-3 text-sm text-texto-suave">Aún no hay trabajos.</p>
      ) : (
        <ul className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {trabajos.data.map((t) => {
            const portada = t.trabajo_imagenes.find((i) => i.es_portada) ?? t.trabajo_imagenes[0];
            const url = urlPublica(portada?.ruta);
            return (
              <li key={t.id} className="overflow-hidden rounded-tarjeta border border-borde bg-fondo shadow-tarjeta">
                {url ? (
                  <Image src={url} alt="" width={600} height={400} unoptimized className="aspect-3/2 w-full object-cover" />
                ) : (
                  <div className="grid aspect-3/2 place-items-center bg-superficie text-sm text-texto-suave">Sin fotos</div>
                )}
                <div className="p-4">
                  <h3 className="font-bold">{t.titulo}</h3>
                  <p className="mt-1 text-xs text-texto-suave">
                    {t.trabajo_imagenes.length} foto(s) · {t.publicado ? "Publicado" : "Borrador"}
                    {t.destacado && " · Destacado"}
                  </p>
                  <Link
                    href={`/admin/galeria/${t.id}`}
                    className="mt-3 inline-flex min-h-[44px] items-center rounded-full border border-borde px-5 text-sm font-semibold transition hover:bg-superficie"
                  >
                    Gestionar
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}