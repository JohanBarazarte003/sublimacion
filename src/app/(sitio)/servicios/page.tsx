import type { Metadata } from "next";

export const metadata: Metadata = { title: "Servicios" };

const servicios = [
  { nombre: "Tazas", texto: "Sublimadas con tu diseño, resistentes al lavado." },
  { nombre: "Franelas", texto: "Tu arte a todo color sobre tela." },
  { nombre: "Gorras", texto: "Personalizadas para ti o tu equipo." },
  { nombre: "Otros", texto: "Consulta por otros productos sublimables." },
];

export default function Servicios() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-3xl font-bold">Servicios</h1>
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {servicios.map((s) => (
          <div key={s.nombre} className="rounded-2xl border border-neutral-200 p-6">
            <h2 className="text-xl font-semibold">{s.nombre}</h2>
            <p className="mt-2 text-neutral-600">{s.texto}</p>
          </div>
        ))}
      </div>
    </section>
  );
}