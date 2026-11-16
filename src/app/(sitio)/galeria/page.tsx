import type { Metadata } from "next";
import { Suspense } from "react";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import TituloSeccion from "@/components/ui/TituloSeccion";
import GaleriaCliente, { type TrabajoPublico } from "@/components/galeria/GaleriaCliente";
import { crearClientePublico } from "@/lib/supabase/publico";

export const metadata: Metadata = {
  title: "Galería",
  description: "Trabajos de personalización y sublimación que ya hemos realizado.",
};

export const revalidate = 60;

export default async function Galeria() {
  const supabase = crearClientePublico();

  const { data, error } = await supabase
    .from("trabajos")
    .select(
      "id, slug, titulo, descripcion, etiquetas, fecha_trabajo, productos(nombre), trabajo_imagenes(id, ruta, alt, ancho, alto, es_portada, orden)"
    )
    .order("destacado", { ascending: false })
    .order("orden")
    .order("creado_en", { ascending: false });

  const trabajos: TrabajoPublico[] = (data ?? [])
    .filter((t) => t.trabajo_imagenes.length > 0)
    .map((t) => ({
      id: t.id,
      slug: t.slug,
      titulo: t.titulo,
      descripcion: t.descripcion,
      etiquetas: t.etiquetas,
      fecha_trabajo: t.fecha_trabajo,
      producto: t.productos?.nombre ?? null,
      fotos: [...t.trabajo_imagenes].sort((a, b) => a.orden - b.orden),
    }));

  return (
    <Container className="py-12 lg:py-20">
      <TituloSeccion etiqueta="Galería">
        Trabajos que <span className="texto-degradado">hablan por nosotros</span>
      </TituloSeccion>

      {error && <p className="mt-8 text-sm text-error">No pudimos cargar la galería. Intenta de nuevo en unos minutos.</p>}

      {!error && trabajos.length === 0 && (
        <div className="mt-10 rounded-tarjeta border border-borde bg-superficie p-8 text-center">
          <p className="font-semibold">Pronto verás aquí nuestros trabajos.</p>
          <Button href="/visor" className="mt-6">Probar el visor 3D</Button>
        </div>
      )}

      <Suspense>
        <GaleriaCliente trabajos={trabajos} />
      </Suspense>
    </Container>
  );
}