import type { Metadata } from "next";
import { siteConfig, whatsappLink } from "../lib/config";

export const metadata: Metadata = { title: "Contacto" };

export default function Contacto() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 text-center">
      <h1 className="text-3xl font-bold">Contacto</h1>
      <p className="mt-4 text-neutral-600">
        Escríbenos y cuéntanos qué quieres personalizar.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <a
          href={whatsappLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-green-500 px-6 py-3 font-medium text-white hover:bg-green-600"
        >
          Escribir por WhatsApp
        </a>
        <a
          href={siteConfig.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-neutral-300 px-6 py-3 font-medium hover:bg-neutral-100"
        >
          Instagram
        </a>
      </div>
    </section>
  );
}