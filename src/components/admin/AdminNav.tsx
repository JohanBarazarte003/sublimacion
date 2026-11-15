"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ClipboardList,
  Images,
  LayoutDashboard,
  Package,
  Percent,
  Settings,
  Wrench,
  type LucideIcon,
} from "lucide-react";

type Seccion = { nombre: string; href: string; icono: LucideIcon; disponible: boolean };

const SECCIONES: Seccion[] = [
  { nombre: "Resumen", href: "/admin", icono: LayoutDashboard, disponible: true },
  { nombre: "Cotizaciones", href: "/admin/cotizaciones", icono: ClipboardList, disponible: false },
  { nombre: "Productos y precios", href: "/admin/productos", icono: Package, disponible: false },
  { nombre: "Promociones", href: "/admin/promociones", icono: Percent, disponible: false },
  { nombre: "Servicios", href: "/admin/servicios", icono: Wrench, disponible: false },
  { nombre: "Galería", href: "/admin/galeria", icono: Images, disponible: false },
  { nombre: "Ajustes", href: "/admin/ajustes", icono: Settings, disponible: false },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Panel" className="mt-4 flex gap-2 overflow-x-auto lg:flex-col">
      {SECCIONES.map(({ nombre, href, icono: Icono, disponible }) => {
        const activo = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
        const base =
          "flex min-h-[44px] shrink-0 items-center gap-3 rounded-2xl px-3 text-sm font-semibold";

        if (!disponible) {
          return (
            <span key={href} className={`${base} cursor-not-allowed text-texto-suave/60`}>
              <Icono size={18} />
              {nombre}
              <span className="ml-auto hidden rounded-full bg-superficie px-2 py-0.5 text-[10px] lg:inline">
                Pronto
              </span>
            </span>
          );
        }

        return (
          <Link
            key={href}
            href={href}
            aria-current={activo ? "page" : undefined}
            className={`${base} transition ${
              activo ? "bg-primario text-sobre-primario" : "hover:bg-superficie"
            }`}
          >
            <Icono size={18} />
            {nombre}
          </Link>
        );
      })}
    </nav>
  );
}