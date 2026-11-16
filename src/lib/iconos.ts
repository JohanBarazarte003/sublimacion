import {
  Brush,
  Gift,
  Headset,
  PackageCheck,
  Palette,
  Printer,
  Shirt,
  Sparkles,
  Truck,
  Zap,
  type LucideIcon,
} from "lucide-react";

// La clave es lo que se guarda en la base; para agregar uno, añade una línea aquí
export const ICONOS_SERVICIO: Record<string, { etiqueta: string; Icono: LucideIcon }> = {
  palette: { etiqueta: "Diseño", Icono: Palette },
  printer: { etiqueta: "Impresión", Icono: Printer },
  gift: { etiqueta: "Regalos", Icono: Gift },
  zap: { etiqueta: "Rápido / exprés", Icono: Zap },
  package: { etiqueta: "Empaque", Icono: PackageCheck },
  sparkles: { etiqueta: "Especial", Icono: Sparkles },
  truck: { etiqueta: "Envíos", Icono: Truck },
  headset: { etiqueta: "Atención", Icono: Headset },
  brush: { etiqueta: "Personalizado", Icono: Brush },
  shirt: { etiqueta: "Ropa", Icono: Shirt },
};