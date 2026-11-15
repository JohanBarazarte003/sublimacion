import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import { CarritoProvider } from "@/lib/carrito/CarritoContext";

export default function SitioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CarritoProvider>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        {/* El espacio superior iguala la altura de la barra fija */}
        <main className="flex-1 pt-20 md:pt-24">{children}</main>
        <Footer />
        <WhatsAppButton />
      </div>
    </CarritoProvider>
  );
}