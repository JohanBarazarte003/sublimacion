export type Producto = {
  id: "taza" | "camisa" | "gorra" | "termo";
  nombre: string;
  descripcion: string;
  emoji: string; // provisional, hasta tener fotos
  disponible: boolean;
  href: string;
};

export const productos: Producto[] = [
  { id: "taza", nombre: "Tazas", descripcion: "Con tu diseño, en vista 3D de 360°.", emoji: "☕", disponible: true, href: "/visor" },
  { id: "camisa", nombre: "Camisas", descripcion: "Frente y espalda a todo color.", emoji: "👕", disponible: false, href: "/servicios" },
  { id: "gorra", nombre: "Gorras", descripcion: "Personalizadas para ti o tu equipo.", emoji: "🧢", disponible: false, href: "/servicios" },
  { id: "termo", nombre: "Termos", descripcion: "Tu arte alrededor de todo el termo.", emoji: "🥤", disponible: false, href: "/servicios" },
];