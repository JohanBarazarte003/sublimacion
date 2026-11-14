import Image from "next/image";
import { ArrowRight, Printer } from "lucide-react";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import { siteConfig } from "@/lib/config";

function VisualPrincipal() {
  const foto = siteConfig.heroImagen;

  return (
    <div
      className="relative mx-auto aspect-square w-full max-w-md animate-entrar-arriba"
      style={{ animationDelay: "150ms" }}
    >
      <div
        aria-hidden
        className="fondo-degradado absolute inset-0 animate-flotar rounded-[3rem] opacity-25 blur-2xl"
      />
      {foto ? (
        <Image
          src={foto.src}
          alt={siteConfig.name}
          width={foto.width}
          height={foto.height}
          priority
          className="relative h-full w-full object-contain"
        />
      ) : (
        <div className="relative grid h-full place-items-center rounded-[3rem] border border-borde bg-fondo/80 p-8 text-center shadow-tarjeta backdrop-blur">
          <div>
            <p className="text-7xl">☕</p>
            <p className="mt-4 text-2xl font-extrabold">Tu arte, en 3D</p>
            <p className="mt-1 text-texto-suave">
              Súbelo, ajústalo y míralo girar antes de pedirlo.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Manchas de tinta decorativas (solo CSS: usan la paleta del tema) */}
      <div aria-hidden className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-acento/40 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -right-20 top-10 h-80 w-80 rounded-full bg-secundario/30 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-16 right-1/4 h-64 w-64 rounded-full bg-primario/20 blur-3xl" />

      <Container className="relative grid items-center gap-10 py-10 lg:grid-cols-2 lg:py-16">
        <div className="animate-entrar-arriba">
          <span className="fondo-degradado inline-flex rounded-full p-[2px]">
            <span className="inline-flex items-center gap-2 rounded-full bg-fondo px-4 py-2 text-sm font-semibold">
              <Printer size={18} />
              Impresión &amp; Personalización
            </span>
          </span>

          <h1 className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Convierte tus ideas en{" "}
            <span className="relative inline-block">
              <span className="texto-degradado">regalos únicos</span>
              <span
                aria-hidden
                className="absolute inset-x-0 -bottom-2 h-2 -rotate-1 rounded-full bg-acento"
              />
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-lg text-texto-suave">
            Diseños personalizados en tazas, camisas, gorras y mucho más. Sube tu
            arte, míralo en 3D y pídelo.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/visor">
              Personaliza ahora
              <ArrowRight size={20} />
            </Button>
            <Button href="/galeria" variante="secundario">
              Ver trabajos
            </Button>
          </div>
        </div>

        <VisualPrincipal />
      </Container>
    </section>
  );
}