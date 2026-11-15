"use client";

import { useActionState, type ReactNode } from "react";
import type { Estado } from "@/lib/admin/respuesta";

type Accion = (estado: Estado, datos: FormData) => Promise<Estado>;

export default function FormAccion({
  accion,
  children,
  className = "",
}: {
  accion: Accion;
  children: ReactNode;
  className?: string;
}) {
  const [estado, ejecutar] = useActionState(accion, null);

  return (
    <form action={ejecutar} className={className}>
      {children}
      {estado && (
        <p
          role={estado.ok ? "status" : "alert"}
          className={`col-span-full w-full text-sm font-medium ${
            estado.ok ? "text-exito" : "text-error"
          }`}
        >
          {estado.mensaje}
        </p>
      )}
    </form>
  );
}