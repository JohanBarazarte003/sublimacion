export type ImagenConfig = { src: string; width: number; height: number };

export const siteConfig = {
  name: "Mi Marca", // cámbialo cuando tengas el nombre
  description:
    "Personaliza tazas, camisas, gorras y más con tu propio arte y míralo en 3D antes de pedirlo.",
  whatsapp: "58412XXXXXXX", // código de país + número, sin + ni ceros iniciales
  instagram: "https://instagram.com/tuusuario",

  // LOGOS: cuando los tengas, copia los archivos a /public/brand/ y completa.
  // Ejemplo: { src: "/brand/logo.svg", width: 800, height: 200 }
  logo: null as ImagenConfig | null,
  logoClaro: null as ImagenConfig | null, // versión blanca para fondos oscuros

  // Foto principal del inicio (opcional). Ejemplo: { src: "/brand/hero.png", width: 1200, height: 1200 }
  heroImagen: null as ImagenConfig | null,

  nav: [
    { label: "Inicio", href: "/" },
    { label: "Servicios", href: "/servicios" },
    { label: "Visor 3D", href: "/visor" },
    { label: "Galería", href: "/galeria" },
    { label: "Contacto", href: "/contacto" },
  ],

  // Solo promete lo que de verdad puedas cumplir
  ventajas: [
    { icono: "calidad", titulo: "Alta calidad", detalle: "Colores vibrantes y duraderos" },
    { icono: "entrega", titulo: "Entrega rápida", detalle: "Tus pedidos a tiempo" },
    { icono: "seguridad", titulo: "Compra segura", detalle: "Cuidamos tus datos" },
    { icono: "soporte", titulo: "Soporte personalizado", detalle: "Estamos para ayudarte" },
  ],
};

export const whatsappLink = (
  mensaje = "Hola, quiero personalizar un producto"
) => `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(mensaje)}`;