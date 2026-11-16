"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { crearClienteNavegador } from "@/lib/supabase/navegador";
import { BUCKET_PUBLICO, urlPublica } from "@/lib/supabase/almacenamiento";
import { reducirImagen } from "@/lib/imagenes/reducir";

const EXTENSIONES: Record<string, string> = {
  "image/webp": "webp",
  "image/png": "png",
  "image/jpeg": "jpg",
};

export default function SubidaImagen({
  carpeta,
  rutaActual,
  etiqueta = "Imagen",
  nombreCampo = "imagen_ruta",
}: {
  carpeta: string;
  rutaActual: string | null;
  etiqueta?: string;
  nombreCampo?: string;
}) {
  const supabase = useMemo(() => crearClienteNavegador(), []);
  const entrada = useRef<HTMLInputElement>(null);
  const guardia = useRef<HTMLInputElement>(null);
  const sinGuardar = useRef<string | null>(null); // subida en esta sesión que aún no se guarda

  const [ruta, setRuta] = useState(rutaActual ?? "");
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Impide enviar el formulario mientras la imagen sigue subiéndose
  useEffect(() => {
    guardia.current?.setCustomValidity(
      subiendo ? "Espera a que termine de subir la imagen." : ""
    );
  }, [subiendo]);

  async function descartarSinGuardar() {
    if (sinGuardar.current) {
      await supabase.storage.from(BUCKET_PUBLICO).remove([sinGuardar.current]);
      sinGuardar.current = null;
    }
  }

  async function alElegir(e: React.ChangeEvent<HTMLInputElement>) {
    const archivo = e.target.files?.[0];
    e.target.value = "";
    if (!archivo) return;

    if (!archivo.type.startsWith("image/")) {
      setError("Elige un archivo de imagen (PNG, JPG o WEBP).");
      return;
    }
    if (archivo.size > 25 * 1024 * 1024) {
      setError("La imagen pesa más de 25 MB. Prueba con una más liviana.");
      return;
    }

    setSubiendo(true);
    setError(null);
    try {
      const { blob } = await reducirImagen(archivo);
      const extension = EXTENSIONES[blob.type];
      if (!extension) throw new Error("Formato no admitido");

      const nueva = `${carpeta}/${crypto.randomUUID()}.${extension}`;
      const { error: errorSubida } = await supabase.storage
        .from(BUCKET_PUBLICO)
        .upload(nueva, blob, {
          contentType: blob.type,
          cacheControl: "31536000", // el nombre es único, se puede cachear un año
          upsert: false,
        });
      if (errorSubida) throw errorSubida;

      await descartarSinGuardar(); // si ya había subido otra antes de guardar, se borra
      sinGuardar.current = nueva;
      setRuta(nueva);
    } catch {
      setError("No se pudo subir la imagen. Intenta de nuevo o prueba con otra.");
    } finally {
      setSubiendo(false);
    }
  }

  async function quitar() {
    await descartarSinGuardar();
    setRuta("");
  }

  const url = urlPublica(ruta);

  return (
    <div>
      <p className="text-sm font-semibold">{etiqueta}</p>

      <div className="mt-2 flex flex-wrap items-center gap-4">
        {url ? (
          <Image
            src={url}
            alt="Vista previa"
            width={96}
            height={96}
            unoptimized
            className="h-24 w-24 rounded-2xl border border-borde object-cover"
          />
        ) : (
          <div className="grid h-24 w-24 place-items-center rounded-2xl border border-dashed border-borde text-xs text-texto-suave">
            Sin imagen
          </div>
        )}

        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={subiendo}
              onClick={() => entrada.current?.click()}
              className="inline-flex min-h-[44px] items-center rounded-full border border-borde px-4 text-sm font-semibold transition hover:bg-superficie disabled:opacity-60"
            >
              {subiendo ? "Subiendo…" : url ? "Cambiar imagen" : "Elegir imagen"}
            </button>
            {url && !subiendo && (
              <button
                type="button"
                onClick={quitar}
                className="inline-flex min-h-[44px] items-center rounded-full border border-error/30 px-4 text-sm font-semibold text-error transition hover:bg-error/10"
              >
                Quitar
              </button>
            )}
          </div>
          <p className="text-xs text-texto-suave">
            Se reduce automáticamente a 1600 px y se guarda como WebP.
          </p>
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-2 text-sm font-medium text-error">
          {error}
        </p>
      )}

      <input
        ref={entrada}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={alElegir}
        className="hidden"
      />
      <input type="hidden" name={nombreCampo} value={ruta} />
      {/* Campo invisible: bloquea el envío mientras hay una subida en curso */}
      <input
        ref={guardia}
        tabIndex={-1}
        aria-hidden
        readOnly
        defaultValue="ok"
        className="sr-only"
      />
    </div>
  );
}