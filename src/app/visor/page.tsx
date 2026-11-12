import type { Metadata } from "next";
import VisorTaza from "@/components/visor/VisorTaza";

export const metadata: Metadata = { title: "Visor 3D" };

export default function Visor() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-3xl font-bold">Visor 3D</h1>
      <p className="mt-2 text-neutral-600">
        Sube tu diseño y gira la taza para ver cómo queda.
      </p>
      <VisorTaza />
    </section>
  );
}