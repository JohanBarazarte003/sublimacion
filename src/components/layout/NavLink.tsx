"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export default function NavLink({
  href,
  children,
  onClick,
  className = "",
}: {
  href: string;
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  const pathname = usePathname();
  const activo = href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={activo ? "page" : undefined}
      className={`inline-block rounded-full px-4 py-2 text-[15px] font-semibold transition duration-200 ${
        activo
          ? "bg-primario text-sobre-primario shadow-boton"
          : "text-texto hover:scale-110 hover:text-primario"
      } ${className}`}
    >
      {children}
    </Link>
  );
}