"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { registrarImagen } from "@/app/admin/galeria/actions";
import { reducirImagen } from "@/lib/imagenes/reducir";
import { BUCKET_PUBLICO } from "@/lib/supabase/almacenamiento";
import { crearClienteNavegador } from "@/lib/supabase/navegador";

const EXTENSIONES: Record<string, string> = { "image/webp": "webp", "image/png": "png", "image/jpeg": "jpg" };

export default function SubidaGaleria({ trabajoId, restantes }: { trabajoId: string; restantes: number }) {
  const router = useRouter();
  const supabase = useMemo(() => crearClienteNavegador(), []);
  const entrada = useRef<HTMLInputElement>(null);
  const [progreso, setProgreso] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function alElegir(e: React.ChangeEvent<HTMLInputElement>) {
    const archivos = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (!archivos.length) return;

    setError(null);
    const lote = archivos.slice(0, restantes);
    if (archivos.length > restantes) {
      setError(`Solo caben ${restantes} foto(s) más; se subirán las primeras ${restantes}.`);
    }

    let fallidas = 0;
    for (let i = 0; i < lote.length; i++) {
      setProgreso(`Subiendo ${i + 1} de ${lote.length}…`);
      const archivo = lote[i];
      try {
        if (!archivo.type.startsWith("image/") || archivo.size > 25 * 1024 * 1024) throw new Error("archivo no válido");

        const { blob, ancho, alto } = await reducirImagen(archivo);
        const extension = EXTENSIONES[blob.type];
        if (!extension) throw new Error("formato no admitido");

        const ruta = `galeria/${trabajoId}/${crypto.randomUUID()}.${extension}`;
        const subida = await supabase.storage
          .from(BUCKET_PUBLICO)
          .upload(ruta, blob, { contentType: blob.type, cacheControl: "31536000", upsert: false });
        if (subida.error) throw subida.error;

        const respuesta = await registrarImagen(trabajoId, ruta, ancho, alto);
        if (!respuesta?.ok) {
          await supabase.storage.from(BUCKET_PUBLICO).remove([ruta]); // sin archivos huérfanos
          throw new Error(respuesta?.mensaje ?? "no se pudo registrar");
        }
      } catch {
        fallidas++;
      }
    }

    setProgreso(null);
    if (fallidas) setError(`No se pudieron subir ${fallidas} foto(s). Revisa el formato (PNG, JPG o WEBP).`);
    router.refresh();
  }

  return (
    <div>
      <button
        type="button"
        disabled={!!progreso || restantes <= 0}
        onClick={() => entrada.current?.click()}
        className="inline-flex min-h-[44px] items-center rounded-full bg-primario px-5 text-sm font-semibold text-sobre-primario transition hover:bg-primario-hover disabled:opacity-60"
      >
        {progreso ?? (restantes > 0 ? "Agregar fotos" : "Límite de fotos alcanzado")}
      </button>
      <p className="mt-2 text-xs text-texto-suave">
        Puedes elegir varias a la vez. Se reducen a 1600 px y se guardan como WebP. Quedan {restantes} espacio(s).
      </p>
      {error && (
        <p role="alert" className="mt-2 text-sm font-medium text-error">
          {error}
        </p>
      )}
      <input ref={entrada} type="file" multiple accept="image/png,image/jpeg,image/webp" onChange={alElegir} className="hidden" />
    </div>
  );
}