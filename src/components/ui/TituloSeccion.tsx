import type { ReactNode } from "react";

export default function TituloSeccion({
  etiqueta,
  children,
  className = "",
}: {
  etiqueta?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      {etiqueta && (
        <span className="inline-block -rotate-2 rounded-md bg-primario px-4 py-1.5 text-sm font-bold text-sobre-primario shadow-boton">
          {etiqueta}
        </span>
      )}
      <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
        {children}
      </h2>
    </div>
  );
}