import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import { CarritoProvider } from "@/lib/carrito/CarritoContext";
import { siteConfig } from "@/lib/config";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: { default: siteConfig.name, template: `%s | ${siteConfig.name}` },
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={poppins.variable}>
      <body className="flex min-h-screen flex-col bg-fondo font-sans text-texto antialiased">
        <CarritoProvider>
          <Navbar />
          {/* El espacio superior iguala la altura de la barra fija */}
          <main className="flex-1 pt-20 md:pt-24">{children}</main>
          <Footer />
          <WhatsAppButton />
        </CarritoProvider>
      </body>
    </html>
  );
}