import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { exigirAdmin } from "@/lib/auth/admin";
import FormAccion from "@/components/admin/formularios/FormAccion";
import BotonEnviar from "@/components/admin/formularios/BotonEnviar";
import Campo from "@/components/admin/formularios/Campo";
import FormularioProducto from "@/components/admin/productos/FormularioProducto";
import TarjetaVariante from "@/components/admin/productos/TarjetaVariante";
import { crearVariante } from "../actions";

export const metadata: Metadata = { title: "Producto" };

const PATRON_UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function ProductoDetalle({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { supabase } = await exigirAdmin();
  if (!PATRON_UUID.test(id)) notFound();

  const [producto, variantes] = await Promise.all([
    supabase.from("productos").select("*").eq("id", id).maybeSingle(),
    supabase.from("variantes").select("*").eq("producto_id", id).order("orden").order("nombre"),
  ]);

  if (!producto.data) notFound();

  const listaVariantes = variantes.data ?? [];
  const precios = await supabase
    .from("precios")
    .select("*")
    .in("variante_id", listaVariantes.map((v) => v.id))
    .order("cantidad_min");

  return (
    <>
      <Link href="/admin/productos" className="text-sm font-semibold text-primario hover:underline">
        ← Productos
      </Link>
      <h1 className="mt-2 text-2xl font-extrabold">{producto.data.nombre}</h1>
      <p className="text-sm text-texto-suave">
        Dirección interna: <code>{producto.data.slug}</code>
      </p>

      <section className="mt-6 rounded-tarjeta border border-borde bg-fondo p-5 shadow-tarjeta">
        <FormularioProducto producto={producto.data} />
      </section>

      <h2 className="mt-10 text-xl font-extrabold">Variantes y precios</h2>
      <p className="mt-1 text-sm text-texto-suave">
        Una variante es una versión del producto con su propio precio (por ejemplo,
        el material o el tamaño).
      </p>

      <div className="mt-4 flex flex-col gap-6">
        {listaVariantes.map((v) => (
          <TarjetaVariante
            key={v.id}
            variante={v}
            precios={(precios.data ?? []).filter((p) => p.variante_id === v.id)}
          />
        ))}
      </div>

      <section className="mt-8 rounded-tarjeta border border-dashed border-borde p-5">
        <h3 className="font-bold">Agregar variante</h3>
        <FormAccion accion={crearVariante} className="mt-3 flex flex-wrap items-end gap-3">
          <input type="hidden" name="producto_id" value={producto.data.id} />
          <Campo etiqueta="Nombre" name="nombre" required maxLength={80} className="w-64" />
          <Campo etiqueta="Material" name="material" maxLength={60} className="w-48" />
          <BotonEnviar>Crear variante</BotonEnviar>
        </FormAccion>
      </section>
    </>
  );
}