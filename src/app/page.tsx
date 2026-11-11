import Link from "next/link";

const pasos = [
  { titulo: "1. Sube tu arte", texto: "Elige tu imagen o diseño." },
  { titulo: "2. Míralo en 3D", texto: "Gira el producto 360° y revisa cómo queda." },
  { titulo: "3. Pídelo", texto: "Confirma por WhatsApp y lo producimos." },
];

export default function Home() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-4 py-20 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Mira tu diseño antes de que exista
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-neutral-600">
          Personaliza tazas y más con tu propio arte y míralo en 3D, girándolo
          360°, antes de pedirlo.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/visor"
            className="rounded-full bg-neutral-900 px-6 py-3 font-medium text-white hover:bg-neutral-700"
          >
            Probar el visor 3D
          </Link>
          <Link
            href="/galeria"
            className="rounded-full border border-neutral-300 px-6 py-3 font-medium hover:bg-neutral-100"
          >
            Ver trabajos
          </Link>
        </div>
      </section>

      <section className="bg-neutral-50 py-16">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:grid-cols-3">
          {pasos.map((p) => (
            <div key={p.titulo} className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="font-semibold">{p.titulo}</h2>
              <p className="mt-2 text-neutral-600">{p.texto}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}