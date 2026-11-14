"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, Search, ShoppingCart, X } from "lucide-react";
import { siteConfig } from "@/lib/config";
import { useCarrito } from "@/lib/carrito/CarritoContext";
import { useScrolled } from "@/hooks/useScrolled";
import Container from "@/components/ui/Container";
import Logo from "@/components/ui/Logo";
import NavLink from "./NavLink";
import BuscadorRapido from "./BuscadorRapido";

const botonIcono =
  "relative grid h-11 w-11 place-items-center rounded-full text-texto transition duration-200 hover:scale-110 hover:bg-superficie hover:text-primario active:scale-95";

export default function Navbar() {
  const reducido = useScrolled(24);
  const { cantidad } = useCarrito();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [buscando, setBuscando] = useState(false);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 animate-entrar-abajo transition-[height,background-color,box-shadow] duration-300 ease-out ${
          reducido
            ? "h-16 bg-fondo/90 shadow-tarjeta backdrop-blur-xl"
            : "h-20 bg-fondo/70 backdrop-blur-md md:h-24"
        }`}
      >
        <Container className="grid h-full grid-cols-[1fr_auto] items-center md:grid-cols-[1fr_auto_1fr]">
          <div className="justify-self-start">
            <Logo compacto={reducido} />
          </div>

          {/* Menú centrado, con entrada escalonada */}
          <nav aria-label="Principal" className="hidden md:block">
            <ul className="flex items-center gap-1">
              {siteConfig.nav.map((item, i) => (
                <li
                  key={item.href}
                  className="animate-entrar-abajo"
                  style={{ animationDelay: `${150 + i * 80}ms` }}
                >
                  <NavLink href={item.href}>{item.label}</NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-1 justify-self-end">
            <button
              aria-label="Buscar"
              onClick={() => setBuscando(true)}
              className={botonIcono}
            >
              <Search size={22} />
            </button>

            <Link
              href="/pedido"
              aria-label={`Mi pedido, ${cantidad} productos`}
              className={botonIcono}
            >
              <ShoppingCart size={22} />
              {cantidad > 0 && (
                <span
                  key={cantidad}
                  className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 animate-pop place-items-center rounded-full bg-primario px-1 text-[11px] font-bold text-sobre-primario"
                >
                  {cantidad}
                </span>
              )}
            </Link>

            <button
              aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={menuAbierto}
              onClick={() => setMenuAbierto(!menuAbierto)}
              className={`${botonIcono} md:hidden`}
            >
              {menuAbierto ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </Container>

        {/* Menú móvil */}
        {menuAbierto && (
          <nav
            aria-label="Menú móvil"
            className="absolute inset-x-0 top-full animate-entrar-abajo border-t border-borde bg-fondo/95 shadow-tarjeta backdrop-blur-xl md:hidden"
          >
            <Container>
              <ul className="flex flex-col gap-1 py-4">
                {siteConfig.nav.map((item) => (
                  <li key={item.href}>
                    <NavLink
                      href={item.href}
                      onClick={() => setMenuAbierto(false)}
                      className="block py-3 text-base"
                    >
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </Container>
          </nav>
        )}
      </header>

      <BuscadorRapido abierto={buscando} alCerrar={() => setBuscando(false)} />
    </>
  );
}