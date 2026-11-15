"use client";

import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";

const ESTILOS = {
  primario: "bg-primario text-sobre-primario hover:bg-primario-hover",
  suave: "border border-borde bg-fondo hover:bg-superficie",
  peligro: "border border-error/30 text-error hover:bg-error/10",
};

export default function BotonEnviar({
  children,
  variante = "primario",
  textoPendiente = "Guardando…",
}: {
  children: ReactNode;
  variante?: keyof typeof ESTILOS;
  textoPendiente?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`inline-flex min-h-[44px] items-center justify-center rounded-full px-5 text-sm font-semibold transition active:scale-95 disabled:opacity-60 ${ESTILOS[variante]}`}
    >
      {pending ? textoPendiente : children}
    </button>
  );
}