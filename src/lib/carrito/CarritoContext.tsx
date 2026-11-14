"use client";

import { createContext, useContext, useMemo, useState } from "react";

export type ItemPedido = {
  id: string;
  producto: string; // "taza", "camisa"...
  cantidad: number;
  vistaPrevia: string; // miniatura del diseño
  notas?: string;
};

type CarritoCtx = {
  items: ItemPedido[];
  cantidad: number;
  agregar: (item: ItemPedido) => void;
  quitar: (id: string) => void;
  vaciar: () => void;
};

const Ctx = createContext<CarritoCtx | null>(null);

export function CarritoProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ItemPedido[]>([]);

  const valor = useMemo<CarritoCtx>(
    () => ({
      items,
      cantidad: items.reduce((total, i) => total + i.cantidad, 0),
      agregar: (item) => setItems((prev) => [...prev, item]),
      quitar: (id) => setItems((prev) => prev.filter((i) => i.id !== id)),
      vaciar: () => setItems([]),
    }),
    [items]
  );

  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>;
}

export function useCarrito() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCarrito debe usarse dentro de <CarritoProvider>");
  return ctx;
}