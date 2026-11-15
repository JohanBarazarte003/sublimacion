import type { Metadata } from "next";
import VisorTaza from "@/components/visor/VisorTaza";

export const metadata: Metadata = { title: "Visor 3D" };

export default function Visor() {
  return (
    <section className="bg-[linear-gradient(180deg,#f5f3ff_0%,#ffffff_320px)]">
      <div className="mx-auto max-w-6xl px-4 pb-24 pt-5 lg:pt-12">
        <h1 className="text-2xl font-bold tracking-tight lg:text-4xl">
          Diseña tu taza en 3D
        </h1>
        <p className="mt-1 hidden text-neutral-600 lg:block">
          Sube tu diseño, ajústalo y mira cómo queda antes de pedirlo.
        </p>
        <VisorTaza />
      </div>
    </section>
  );
}