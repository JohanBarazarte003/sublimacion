import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { exigirAdmin } from "@/lib/auth/admin";
import { urlPublica } from "@/lib/supabase/almacenamiento";
import { PATRON_UUID } from "@/lib/validacion/campos";
import FormAccion from "@/components/admin/formularios/FormAccion";
import BotonEnviar from "@/components/admin/formularios/BotonEnviar";
import FormularioTrabajo from "@/components/admin/galeria/FormularioTrabajo";
import SubidaGaleria from "@/components/admin/galeria/SubidaGaleria";
import { definirPortada, eliminarImagen, eliminarTrabajo } from "../actions";

export const metadata: Metadata = { title: "Trabajo" };

const MAX_IMAGENES = 6;

export default async function TrabajoAdmin({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase } = await exigirAdmin();
  if (!PATRON_UUID.test(id)) notFound();

  const [trabajo, imagenes, productos] = await Promise.all([
    supabase.from("trabajos").select("*").eq("id", id).maybeSingle(),
    supabase.from("trabajo_imagenes").select("*").eq("trabajo_id", id).order("orden"),
    supabase.from("productos").select("id, nombre").order("orden"),
  ]);
  if (!trabajo.data) notFound();

  const fotos = imagenes.data ?? [];

  return (
    <>
      <Link href="/admin/galeria" className="text-sm font-semibold text-primario hover:underline">
        ← Galería
      </Link>
      <h1 className="mt-2 text-2xl font-extrabold">{trabajo.data.titulo}</h1>
      <p className="text-sm text-texto-suave">
        Enlace directo: <code>/galeria?trabajo={trabajo.data.slug}</code>
      </p>

      <section className="mt-6 rounded-tarjeta border border-borde bg-fondo p-5 shadow-tarjeta">
        <h2 className="text-lg font-bold">Fotos ({fotos.length}/{MAX_IMAGENES})</h2>
        {fotos.length === 0 && (
          <p className="mt-2 text-sm font-medium text-error">Sin fotos no se mostrará nada bonito en el sitio. Agrega al menos una.</p>
        )}

        <ul className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3">
          {fotos.map((f) => (
            <li key={f.id} className="overflow-hidden rounded-2xl border border-borde">
              <div className="relative">
                <Image src={urlPublica(f.ruta)!} alt={f.alt} width={400} height={300} unoptimized className="aspect-4/3 w-full object-cover" />
                {f.es_portada && (
                  <span className="absolute left-2 top-2 rounded-full bg-acento px-3 py-1 text-xs font-bold text-tinta">Portada</span>
                )}
              </div>
              <div className="flex flex-wrap gap-2 p-3">
                {!f.es_portada && (
                  <FormAccion accion={definirPortada}>
                    <input type="hidden" name="id" value={f.id} />
                    <BotonEnviar variante="suave" textoPendiente="…">Hacer portada</BotonEnviar>
                  </FormAccion>
                )}
                <FormAccion accion={eliminarImagen} confirmar="¿Eliminar esta foto?">
                  <input type="hidden" name="id" value={f.id} />
                  <BotonEnviar variante="peligro" textoPendiente="…">Quitar</BotonEnviar>
                </FormAccion>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-5">
          <SubidaGaleria trabajoId={id} restantes={MAX_IMAGENES - fotos.length} />
        </div>
      </section>

      <section className="mt-6 rounded-tarjeta border border-borde bg-fondo p-5 shadow-tarjeta">
        <h2 className="text-lg font-bold">Datos del trabajo</h2>
        <div className="mt-4">
          <FormularioTrabajo trabajo={trabajo.data} productos={productos.data ?? []} />
        </div>
        <FormAccion accion={eliminarTrabajo} confirmar="¿Eliminar este trabajo y todas sus fotos? No se puede deshacer." className="mt-6">
          <input type="hidden" name="id" value={trabajo.data.id} />
          <BotonEnviar variante="peligro" textoPendiente="Eliminando…">Eliminar trabajo</BotonEnviar>
        </FormAccion>
      </section>
    </>
  );
}