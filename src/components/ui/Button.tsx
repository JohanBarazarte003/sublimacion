import Link from "next/link";
import type { MouseEventHandler, ReactNode } from "react";

type Variante = "primario" | "secundario" | "fantasma";

const base =
  "inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full px-7 text-base font-semibold transition duration-200 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primario disabled:pointer-events-none disabled:opacity-50";

const variantes: Record<Variante, string> = {
  primario:
    "bg-primario text-sobre-primario shadow-boton hover:-translate-y-0.5 hover:bg-primario-hover",
  secundario:
    "border-2 border-texto/15 bg-fondo text-texto hover:border-primario hover:text-primario",
  fantasma: "text-texto hover:bg-superficie",
};

type Comun = { variante?: Variante; className?: string; children: ReactNode };

type ComoEnlace = Comun & {
  href: string;
  target?: string;
  rel?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
};

type ComoBoton = Comun & {
  href?: undefined;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

export default function Button(props: ComoEnlace | ComoBoton) {
  const { variante = "primario", className = "", children } = props;
  const clases = `${base} ${variantes[variante]} ${className}`;

  if (props.href !== undefined) {
    return (
      <Link
        href={props.href}
        target={props.target}
        rel={props.rel}
        onClick={props.onClick}
        className={clases}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type={props.type ?? "button"}
      disabled={props.disabled}
      onClick={props.onClick}
      className={clases}
    >
      {children}
    </button>
  );
}