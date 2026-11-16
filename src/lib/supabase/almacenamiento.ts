export const BUCKET_PUBLICO = "publico";

// URL pública de un archivo guardado en el bucket "publico"
export function urlPublica(ruta: string | null | undefined): string | null {
  if (!ruta) return null;
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${BUCKET_PUBLICO}/${ruta}`;
}