import { Gem, Headset, Rocket, ShieldCheck, type LucideIcon } from "lucide-react";
import Container from "@/components/ui/Container";
import { siteConfig } from "@/lib/config";

const ICONOS: Record<string, LucideIcon> = {
  calidad: Gem,
  entrega: Rocket,
  seguridad: ShieldCheck,
  soporte: Headset,
};

const COLORES = [
  "bg-primario/10 text-primario",
  "bg-secundario/15 text-secundario",
  "bg-acento/40 text-tinta",
  "bg-primario/10 text-primario",
];

export default function Ventajas() {
  return (
    <section className="pb-6">
      <Container>
        <ul className="grid gap-5 rounded-tarjeta border border-borde bg-fondo p-6 shadow-tarjeta sm:grid-cols-2 lg:grid-cols-4">
          {siteConfig.ventajas.map((v, i) => {
            const Icono = ICONOS[v.icono] ?? Gem;
            return (
              <li key={v.titulo} className="flex items-center gap-4">
                <span
                  className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${COLORES[i % COLORES.length]}`}
                >
                  <Icono size={26} />
                </span>
                <div>
                  <p className="font-bold">{v.titulo}</p>
                  <p className="text-sm text-texto-suave">{v.detalle}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}