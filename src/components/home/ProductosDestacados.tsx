import Link from "next/link";
import Container from "@/components/ui/Container";
import TituloSeccion from "@/components/ui/TituloSeccion";
import { productos } from "@/lib/productos";

export default function ProductosDestacados() {
  return (
    <section className="py-16 lg:py-24">
      <Container>
        <TituloSeccion etiqueta="Nuestros servicios">
          Todo lo que necesitas en <span className="texto-degradado">un solo lugar</span>
        </TituloSeccion>

        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {productos.map((p) => (
            <li key={p.id}>
              <Link
                href={p.href}
                className="group block overflow-hidden rounded-tarjeta border border-borde bg-fondo shadow-tarjeta transition duration-300 hover:-translate-y-1.5"
              >
                <div className="fondo-degradado relative grid h-40 place-items-center">
                  <span className="text-6xl transition duration-300 group-hover:scale-110">
                    {p.emoji}
                  </span>
                  {!p.disponible && (
                    <span className="absolute right-3 top-3 rounded-full bg-acento px-3 py-1 text-xs font-bold text-tinta">
                      Próximamente
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold">{p.nombre}</h3>
                  <p className="mt-1 text-sm text-texto-suave">{p.descripcion}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}