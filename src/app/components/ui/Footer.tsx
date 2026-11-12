import { siteConfig } from "@/lib/config";

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-sm text-neutral-500 sm:flex-row">
        <p>
          © {new Date().getFullYear()} {siteConfig.name}. Todos los derechos
          reservados.
        </p>
        <a
          href={siteConfig.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-neutral-900"
        >
          Instagram
        </a>
      </div>
    </footer>
  );
}