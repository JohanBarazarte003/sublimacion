"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { urlPublica } from "@/lib/supabase/almacenamiento";

export type FotoPublica = { id: string; ruta: string; alt: string; ancho: number | null; alto: number | null; es_portada: boolean; orden: number };
export type TrabajoPublico = {
  id: string;
  slug: string;
  titulo: string;
  descripcion: string | null;
  etiquetas: string[];
  fecha_trabajo: string | null;
  producto: string | null;
  fotos: FotoPublica[];
};

function Modal({ trabajo, alCerrar }: { trabajo: TrabajoPublico; alCerrar: () => void }) {
  const dialogo = useRef<HTMLDialogElement>(null);
  const [indice, setIndice] = useState(0);
  const total = trabajo.fotos.length;

  useEffect(() => {
    const d = dialogo.current;
    if (d && !d.open) d.showModal();
    return () => d?.close();
  }, []);

  useEffect(() => {
    const alTecla = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setIndice((i) => (i + 1) % total);
      if (e.key === "ArrowLeft") setIndice((i) => (i - 1 + total) % total);
    };
    window.addEventListener("keydown", alTecla);
    return () => window.removeEventListener("keydown", alTecla);
  }, [total]);

  const foto = trabajo.fotos[indice];
  const url = urlPublica(foto?.ruta);
  const fecha = trabajo.fecha_trabajo
    ? new Date(`${trabajo.fecha_trabajo}T12:00:00`).toLocaleDateString("es-VE", { month: "long", year: "numeric" })
    : null;

  return (
    <dialog
      ref={dialogo}
      onClose={alCerrar}
      onClick={(e) => e.target === e.currentTarget && alCerrar()}
      aria-label={trabajo.titulo}
      className="m-auto max-h-[94dvh] w-[min(96vw,64rem)] overflow-y-auto rounded-tarjeta bg-fondo p-0 text-texto shadow-tarjeta backdrop:bg-tinta/60 backdrop:backdrop-blur-sm"
    >
      <div className="grid md:grid-cols-[1.4fr_1fr]">
        <div className="relative bg-superficie">
          {url && (
            <Image
              src={url}
              alt={foto.alt || trabajo.titulo}
              width={foto.ancho ?? 1200}
              height={foto.alto ?? 900}
              sizes="(min-width: 768px) 55vw, 96vw"
              className="max-h-[60dvh] w-full object-contain md:max-h-[80dvh]"
            />
          )}
          {total > 1 && (
            <>
              <button
                aria-label="Foto anterior"
                onClick={() => setIndice((indice - 1 + total) % total)}
                className="absolute left-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-fondo/90 shadow transition hover:scale-110"
              >
                <ChevronLeft />
              </button>
              <button
                aria-label="Foto siguiente"
                onClick={() => setIndice((indice + 1) % total)}
                className="absolute right-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-fondo/90 shadow transition hover:scale-110"
              >
                <ChevronRight />
              </button>
              <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
                {trabajo.fotos.map((f, i) => (
                  <button
                    key={f.id}
                    aria-label={`Ver foto ${i + 1}`}
                    onClick={() => setIndice(i)}
                    className={`h-2.5 rounded-full transition-all ${i === indice ? "w-6 bg-primario" : "w-2.5 bg-tinta/30"}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="flex flex-col gap-4 p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              {trabajo.producto && <span className="text-xs font-bold uppercase tracking-wider text-primario">{trabajo.producto}</span>}
              <h2 className="text-2xl font-extrabold leading-tight">{trabajo.titulo}</h2>
              {fecha && <p className="mt-1 text-sm capitalize text-texto-suave">{fecha}</p>}
            </div>
            <button aria-label="Cerrar" onClick={alCerrar} className="grid h-11 w-11 shrink-0 place-items-center rounded-full hover:bg-superficie">
              <X />
            </button>
          </div>

          {trabajo.descripcion && <p className="whitespace-pre-line text-texto-suave">{trabajo.descripcion}</p>}

          {trabajo.etiquetas.length > 0 && (
            <ul className="flex flex-wrap gap-2">
              {trabajo.etiquetas.map((e) => (
                <li key={e} className="rounded-full bg-superficie px-3 py-1 text-xs font-semibold">#{e}</li>
              ))}
            </ul>
          )}

          <Link
            href="/visor"
            className="mt-auto inline-flex min-h-[48px] items-center justify-center rounded-full bg-primario px-6 font-semibold text-sobre-primario shadow-boton transition hover:bg-primario-hover"
          >
            Diseña el tuyo
          </Link>
        </div>
      </div>
    </dialog>
  );
}

export default function GaleriaCliente({ trabajos }: { trabajos: TrabajoPublico[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const parametros = useSearchParams();
  const [filtro, setFiltro] = useState<string>("todos");

  const slugAbierto = parametros.get("trabajo");
  const abierto = trabajos.find((t) => t.slug === slugAbierto) ?? null;

  const productos = useMemo(() => [...new Set(trabajos.map((t) => t.producto).filter((p): p is string => !!p))], [trabajos]);
  const visibles = filtro === "todos" ? trabajos : trabajos.filter((t) => t.producto === filtro);

  const chip = (activo: boolean) =>
    `min-h-[44px] rounded-full px-5 text-sm font-semibold transition active:scale-95 ${
      activo ? "bg-primario text-sobre-primario shadow-boton" : "border border-borde bg-fondo hover:border-primario hover:text-primario"
    }`;

  return (
    <>
      {productos.length > 1 && (
        <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="Filtrar por producto">
          <button onClick={() => setFiltro("todos")} className={chip(filtro === "todos")}>Todos</button>
          {productos.map((p) => (
            <button key={p} onClick={() => setFiltro(p)} className={chip(filtro === p)}>{p}</button>
          ))}
        </div>
      )}

      <ul className="mt-8 columns-1 gap-5 sm:columns-2 lg:columns-3">
        {visibles.map((t) => {
          const portada = t.fotos.find((f) => f.es_portada) ?? t.fotos[0];
          const url = urlPublica(portada?.ruta);
          if (!url) return null;
          return (
            <li key={t.id} className="mb-5 break-inside-avoid">
              <button
                onClick={() => router.push(`${pathname}?trabajo=${t.slug}`, { scroll: false })}
                className="group relative block w-full overflow-hidden rounded-tarjeta border border-borde bg-superficie text-left shadow-tarjeta transition duration-300 hover:-translate-y-1"
              >
                <Image
                  src={url}
                  alt={portada.alt || t.titulo}
                  width={portada.ancho ?? 800}
                  height={portada.alto ?? 800}
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="h-auto w-full transition duration-500 group-hover:scale-105"
                />
                <span className="absolute inset-x-0 bottom-0 bg-linear-to-t from-tinta/80 to-transparent p-4 pt-12 text-white">
                  {t.producto && <span className="block text-xs font-bold uppercase tracking-wider text-acento">{t.producto}</span>}
                  <span className="block font-bold">{t.titulo}</span>
                </span>
                {t.fotos.length > 1 && (
                  <span className="absolute right-3 top-3 rounded-full bg-fondo/90 px-3 py-1 text-xs font-bold">{t.fotos.length} fotos</span>
                )}
              </button>
            </li>
          );
        })}
      </ul>

      {abierto && (
        <Modal key={abierto.slug} trabajo={abierto} alCerrar={() => router.replace(pathname, { scroll: false })} />
      )}
    </>
  );
}