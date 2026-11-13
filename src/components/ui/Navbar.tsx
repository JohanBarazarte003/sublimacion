"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { siteConfig } from "@/lib/config";

export default function Navbar() {
  const [abierto, setAbierto] = useState(false);
  const pathname = usePathname();

  const clase = (href: string) =>
    `text-sm font-medium transition hover:text-neutral-900 ${
      pathname === href ? "text-neutral-900" : "text-neutral-500"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-900 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="text-lg font-bold">
          {siteConfig.name}
        </Link>

        <ul className="hidden gap-6 md:flex">
          {siteConfig.nav.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className={clase(item.href)}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <button
          className="text-2xl md:hidden"
          onClick={() => setAbierto(!abierto)}
          aria-label="Abrir menú"
          aria-expanded={abierto}
        >
          {abierto ? "✕" : "☰"}
        </button>
      </nav>

      {abierto && (
        <ul className="flex flex-col gap-4 border-t border-neutral-200 px-4 py-4 md:hidden">
          {siteConfig.nav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={clase(item.href)}
                onClick={() => setAbierto(false)}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}