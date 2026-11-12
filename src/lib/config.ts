export const siteConfig = {
    name: "Mi Marca",
    description:
        "Personaliza tazas y más con tu propio arte y míralo en 3D antes de pedirlo.",
    whatsapp: "58412xxxxxxxx",
    instagram: "https://instagram.com/tuusuario",
    nav: [
        {label: "Inicio", href: "/"},
        {label: "Servicios", href: "/servicios"},
        {label: "Visor 3D", href: "/visor"},
        {label: "Galería", href: "/galeria"},
        {label: "Contacto", href: "/contacto"},
    ],
};


export const whatsappLink = (
    mensaje = "Hola, quiero personalizar un producto"
) => `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(mensaje)}`;