import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/config";

type Props = { compacto?: boolean; sobreOscuro?: boolean };

export default function Logo({ compacto = false, sobreOscuro = false }: Props) {
  const logo = sobreOscuro ? siteConfig.logoClaro : siteConfig.logo;
  const transicion = "transition-all duration-300 ease-out";

  return (
    <Link
      href="/"
      aria-label={`${siteConfig.name}: ir al inicio`}
      className="inline-flex items-center"
    >
      {logo ? (
        <Image
          src={logo.src}
          alt={siteConfig.name}
          width={logo.width}
          height={logo.height}
          priority={!sobreOscuro}
          unoptimized={logo.src.endsWith(".svg")}
          className={`w-auto ${transicion} ${compacto ? "h-9 md:h-10" : "h-12 md:h-14"}`}
        />
      ) : (
        <span
          className={`font-extrabold tracking-tight ${transicion} ${
            sobreOscuro ? "text-white" : "texto-degradado"
          } ${compacto ? "text-xl" : "text-2xl md:text-3xl"}`}
        >
          {siteConfig.name}
        </span>
      )}
    </Link>
  );
}