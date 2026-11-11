import type { Metadata } from "next";

export const metadata: Metadata = { title: "Galería" };

export default function Galeria() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-3xl font-bold">Galería</h1>
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="aspect-square rounded-2xl bg-neutral-100"
            aria-hidden
          />
        ))}
      </div>
    </section>
  );
}