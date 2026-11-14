import Link from "next/link";
import Container from "@/components/ui/Container";
import Logo from "@/components/ui/Logo";
import { siteConfig, whatsappLink } from "@/lib/config";

const titulo = "text-sm font-bold uppercase tracking-wider text-acento";
const enlace = "text-white/70 transition hover:text-white";

export default function Footer() {
  return (
    <footer className="bg-tinta text-white">
      <div className="fondo-degradado h-1.5" />

      <Container className="grid gap-10 py-12 md:grid-cols-3">
        <div>
          <Logo sobreOscuro />
          <p className="mt-4 max-w-xs text-sm text-white/70">{siteConfig.description}</p>
        </div>

        <nav aria-label="Pie de página">
          <h3 className={titulo}>Explora</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={enlace}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h3 className={titulo}>Contacto</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className={enlace}>
                WhatsApp
              </a>
            </li>
            <li>
              <a href={siteConfig.instagram} target="_blank" rel="noopener noreferrer" className={enlace}>
                Instagram
              </a>
            </li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-white/10 py-5 text-center text-xs text-white/50">
        © {new Date().getFullYear()} {siteConfig.name}. Todos los derechos reservados.
      </div>
    </footer>
  );
}