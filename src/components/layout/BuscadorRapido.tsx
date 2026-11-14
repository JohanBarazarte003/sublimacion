"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { siteConfig } from "@/lib/config";
import { productos } from "@/lib/productos";

type Resultado = { titulo: string; detalle: string; href: string };

const normalizar = (texto: string) =>
  texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

export default function BuscadorRapido({
  abierto,
  alCerrar,
}: {
  abierto: boolean;
  alCerrar: () => void;
}) {
  const dialogo = useRef<HTMLDialogElement>(null);
  const [consulta, setConsulta] = useState("");

  // Lo que se puede buscar. Crece solo al agregar productos y páginas.
  const indice = useMemo<Resultado[]>(
    () => [
      ...productos.map((p) => ({
        titulo: p.nombre,
        detalle: p.disponible ? p.descripcion : "Próximamente",
        href: p.href,
      })),
      ...siteConfig.nav.map((n) => ({ titulo: n.label, detalle: "Página", href: n.href })),
    ],
    []
  );

  const resultados = useMemo(() => {
    const q = normalizar(consulta.trim());
    if (!q) return indice.slice(0, 6);
    return indice.filter((r) => normalizar(`${r.titulo} ${r.detalle}`).includes(q));
  }, [consulta, indice]);

  useEffect(() => {
    const d = dialogo.current;
    if (!d) return;
    if (abierto && !d.open) d.showModal();
    if (!abierto && d.open) d.close();
  }, [abierto]);

  return (
    <dialog
      ref={dialogo}
      onClose={() => {
        setConsulta("");
        alCerrar();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) alCerrar();
      }}
      className="m-0 mx-auto mt-[12vh] w-[min(92vw,34rem)] rounded-tarjeta bg-fondo p-0 text-texto shadow-tarjeta backdrop:bg-tinta/50 backdrop:backdrop-blur-sm"
    >
      <div className="flex items-center gap-3 border-b border-borde px-4">
        <Search size={20} className="shrink-0 text-texto-suave" />
        <input
          autoFocus
          value={consulta}
          onChange={(e) => setConsulta(e.target.value)}
          placeholder="Buscar tazas, camisas, galería…"
          className="h-14 w-full bg-transparent text-base outline-none placeholder:text-texto-suave"
        />
        <button
          onClick={alCerrar}
          aria-label="Cerrar búsqueda"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full hover:bg-superficie"
        >
          <X size={20} />
        </button>
      </div>

      <ul className="max-h-[50vh] overflow-y-auto p-2">
        {resultados.length === 0 && (
          <li className="px-3 py-6 text-center text-sm text-texto-suave">
            No encontramos resultados.
          </li>
        )}
        {resultados.map((r) => (
          <li key={`${r.titulo}-${r.href}`}>
            <Link
              href={r.href}
              onClick={alCerrar}
              className="flex items-center justify-between gap-4 rounded-2xl px-3 py-3 transition hover:bg-superficie"
            >
              <span className="font-semibold">{r.titulo}</span>
              <span className="text-sm text-texto-suave">{r.detalle}</span>
            </Link>
          </li>
        ))}
      </ul>
    </dialog>
  );
}