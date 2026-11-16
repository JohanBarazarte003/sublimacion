import type { ReactNode, SelectHTMLAttributes } from "react";

type Props = Omit<SelectHTMLAttributes<HTMLSelectElement>, "className" | "name"> & {
  etiqueta: string;
  name: string;
  className?: string;
  children: ReactNode;
};

export default function Selector({ etiqueta, name, className = "", children, ...resto }: Props) {
  return (
    <label className={`block text-sm font-semibold ${className}`}>
      {etiqueta}
      <select
        name={name}
        {...resto}
        className="mt-1 block min-h-[44px] w-full rounded-xl border border-borde bg-fondo px-3 text-base font-normal outline-none transition focus:border-primario focus:ring-4 focus:ring-primario/15"
      >
        {children}
      </select>
    </label>
  );
}