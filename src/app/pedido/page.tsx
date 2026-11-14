import type { Metadata } from "next";
import { ShoppingBag } from "lucide-react";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";

export const metadata: Metadata = { title: "Mi pedido" };

export default function Pedido() {
  return (
    <Container className="py-20 text-center">
      <ShoppingBag size={48} className="mx-auto text-primario" />
      <h1 className="mt-4 text-3xl font-extrabold">Tu pedido está vacío</h1>
      <p className="mx-auto mt-2 max-w-md text-texto-suave">
        Diseña tu primer producto en el visor 3D y agrégalo aquí para enviar tu
        solicitud.
      </p>
      <Button href="/visor" className="mt-8">
        Ir al visor 3D
      </Button>
    </Container>
  );
}