import type { Metadata } from "next";
import Image from "next/image";
import { Sparkles } from "lucide-react";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import TituloSeccion from "@/components/ui/TituloSeccion";
import { whatsappLink } from "@/lib/config";
import { ICONOS_SERVICIO } from "@/lib/iconos";
import { urlPublica } from "@/lib/supabase/almacenamiento";
import { crearClientePublico } from "@/lib/supabase/publico";

export const metadata: Metadata = {
  title: "Servicios",
  description: "Diseño, personalización e impresión por sublimación.",
};

export const revalidate = 60; // se refresca solo; al guardar en el panel, al instante

export default async function Servicios() {
  const supabase = crearClientePublico();

  const [servicios, ajuste] = await Promise.all([
    supabase
      .from("servicios")
      .select("id, titulo, descripcion, icono, imagen_ruta, precio_desde")
      .order("orden")
      .order("titulo"),
    supabase.from("ajustes").select("valor").eq("clave", "mostrar_precios").maybeSingle(),
  ]);

  const lista = servicios.data ?? [];
  const mostrarPrecios = ajuste.data?.valor === true;

  return (
    <Container className="py-12 lg:py-20">
      <TituloSeccion etiqueta="Servicios">
        Todo lo que hacemos <span className="texto-degradado">por ti</span>
      </TituloSeccion>

      {servicios.error && (
        <p className="mt-8 text-sm text-error">
          No pudimos cargar los servicios. Intenta de nuevo en unos minutos.
        </p>
      )}

      {!servicios.error && lista.length === 0 && (
        <div className="mt-10 rounded-tarjeta border border-borde bg-superficie p-8 text-center">
          <p className="font-semibold">Pronto publicaremos todos nuestros servicios.</p>
          <p className="mt-1 text-sm text-texto-suave">Mientras tanto, escríbenos y cuéntanos qué necesitas.</p>
          <Button href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="mt-6">
            Escribir por WhatsApp
          </Button>
        </div>
      )}

      <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {lista.map((s) => {
          const url = urlPublica(s.imagen_ruta);
          const Icono = (s.icono && ICONOS_SERVICIO[s.icono]?.Icono) || Sparkles;

          return (
            <li
              key={s.id}
              className="flex flex-col overflow-hidden rounded-tarjeta border border-borde bg-fondo shadow-tarjeta"
            >
              {url ? (
                <Image
                  src={url}
                  alt={s.titulo}
                  width={800}
                  height={500}
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="aspect-[16/10] w-full object-cover"
                />
              ) : (
                <div className="fondo-degradado grid aspect-[16/10] place-items-center text-white">
                  <Icono size={44} />
                </div>
              )}

              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-lg font-bold">{s.titulo}</h3>
                {s.descripcion && <p className="mt-2 text-sm text-texto-suave">{s.descripcion}</p>}

                {mostrarPrecios && s.precio_desde != null && (
                  <p className="mt-3 text-sm font-semibold">
                    Desde {Number(s.precio_desde).toFixed(2)} USD
                  </p>
                )}

                <Button
                  href={whatsappLink(`Hola, quiero información sobre: ${s.titulo}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  variante="secundario"
                  className="mt-5"
                >
                  Consultar
                </Button>
              </div>
            </li>
          );
        })}
      </ul>
    </Container>
  );
}