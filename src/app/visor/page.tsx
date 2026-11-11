import type { Metadata } from "next";

export const metadata: Metadata = { title: "Visor 3D" };

export default function Visor() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-3xl font-bold">Visor 3D</h1>
      <div className="mt-8 flex h-96 items-center justify-center rounded-2xl border border-dashed border-neutral-300 text-neutral-500">
        Aquí irá la taza 3D
      </div>
    </section>
  );
}