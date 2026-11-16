export type ImagenReducida = { blob: Blob; ancho: number; alto: number };

// Reduce una imagen en el navegador (lado mayor máximo) y la convierte a WebP
export async function reducirImagen(
  archivo: File,
  ladoMax = 1600,
  calidad = 0.85
): Promise<ImagenReducida> {
  const bitmap = await createImageBitmap(archivo);
  const factor = Math.min(1, ladoMax / Math.max(bitmap.width, bitmap.height));
  const ancho = Math.round(bitmap.width * factor);
  const alto = Math.round(bitmap.height * factor);

  const lienzo = document.createElement("canvas");
  lienzo.width = ancho;
  lienzo.height = alto;
  const ctx = lienzo.getContext("2d");
  if (!ctx) throw new Error("No se pudo procesar la imagen");
  ctx.drawImage(bitmap, 0, 0, ancho, alto);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolver) =>
    lienzo.toBlob(resolver, "image/webp", calidad)
  );
  if (!blob) throw new Error("No se pudo convertir la imagen");
  return { blob, ancho, alto };
}