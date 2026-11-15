import type { InputHTMLAttributes } from "react";

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "className" | "name"> & {
  etiqueta: string;
  name: string;
  className?: string; // se aplica al contenedor (por ejemplo, para el ancho)
};

export default function Campo({ etiqueta, name, className = "", ...resto }: Props) {
  return (
    <label className={`block text-sm font-semibold ${className}`}>
      {etiqueta}
      <input
        name={name}
        {...resto}
        className="mt-1 block min-h-[44px] w-full rounded-xl border border-borde bg-fondo px-3 text-base font-normal outline-none transition focus:border-primario focus:ring-4 focus:ring-primario/15"
      />
    </label>
  );
}