"use client";

import { useEffect, useState } from "react";
import * as THREE from "three";
import TazaViewer from "./TazaViewer";
import { crearTextura } from "./crearTextura";

export default function VisorTaza() {
  const [textura, setTextura] = useState<THREE.CanvasTexture | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);

  // Libera la memoria de la textura anterior al cambiarla o al salir de la página
  useEffect(() => {
    return () => {
      textura?.dispose();
    };
  }, [textura]);

  function alElegirArchivo(e: React.ChangeEvent<HTMLInputElement>) {
    const archivo = e.target.files?.[0];
    e.target.value = ""; // permite volver a elegir el mismo archivo
    if (!archivo) return;

    if (!archivo.type.startsWith("image/")) {
      setError("Elige un archivo de imagen (PNG, JPG o WEBP).");
      return;
    }

    const url = URL.createObjectURL(archivo);
    const img = new Image();

    img.onload = () => {
      setTextura(crearTextura(img));
      setError(null);
      setAviso(
        img.width < 1600
          ? "La imagen tiene baja resolución y podría verse pixelada al imprimir."
          : null
      );
      URL.revokeObjectURL(url);
    };

    img.onerror = () => {
      setError("No se pudo leer la imagen. Prueba con otra.");
      URL.revokeObjectURL(url);
    };

    img.src = url;
  }

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[2fr_1fr]">
      <div className="h-[420px] overflow-hidden rounded-2xl bg-neutral-100 md:h-[560px]">
        <TazaViewer textura={textura} />
      </div>

      <div className="flex flex-col gap-4">
        <label className="cursor-pointer rounded-full bg-neutral-900 px-6 py-3 text-center font-medium text-white hover:bg-neutral-700">
          Subir mi diseño
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={alElegirArchivo}
            className="hidden"
          />
        </label>

        {textura && (
          <button
            onClick={() => {
              setTextura(null);
              setAviso(null);
            }}
            className="rounded-full border border-neutral-300 px-6 py-3 font-medium hover:bg-neutral-100"
          >
            Quitar diseño
          </button>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}
        {aviso && <p className="text-sm text-amber-600">{aviso}</p>}

        <p className="text-sm text-neutral-500">
          Arrastra para girar la taza y usa la rueda del ratón (o pellizca en el
          celular) para acercar. Es una vista aproximada: el color final al
          imprimir puede variar un poco.
        </p>
      </div>
    </div>
  );
}