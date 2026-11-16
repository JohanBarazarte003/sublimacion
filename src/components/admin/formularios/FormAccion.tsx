"use client";

import {
  createContext,
  startTransition,
  useActionState,
  useContext,
  type ReactNode,
} from "react";
import type { Estado } from "@/lib/admin/respuesta";

type Accion = (estado: Estado, datos: FormData) => Promise<Estado>;

const ContextoPendiente = createContext(false);
export const usePendiente = () => useContext(ContextoPendiente);

export default function FormAccion({
  accion,
  children,
  className = "",
  confirmar,
}: {
  accion: Accion;
  children: ReactNode;
  className?: string;
  confirmar?: string; // si se indica, pide confirmación antes de enviar
}) {
  const [estado, ejecutar, pendiente] = useActionState(accion, null);

  return (
    <form
      className={className}
      onSubmit={(e) => {
        e.preventDefault();
        if (confirmar && !window.confirm(confirmar)) return;
        const datos = new FormData(e.currentTarget);
        startTransition(() => ejecutar(datos));
      }}
    >
      <ContextoPendiente.Provider value={pendiente}>
        {/* Al guardar con éxito los campos se reinician; si hay error se conserva lo escrito */}
        <div key={estado?.ok ? estado.id : "base"} className="contents">
          {children}
        </div>
      </ContextoPendiente.Provider>

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