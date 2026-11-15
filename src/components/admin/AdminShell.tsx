import Link from "next/link";
import { LogOut } from "lucide-react";
import { cerrarSesion } from "@/lib/auth/acciones";
import AdminNav from "./AdminNav";

export default function AdminShell({
  email,
  children,
}: {
  email: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-superficie lg:grid lg:grid-cols-[16rem_1fr]">
      <aside className="border-b border-borde bg-fondo p-4 lg:min-h-screen lg:border-b-0 lg:border-r">
        <Link href="/admin" className="texto-degradado block text-xl font-extrabold">
          Panel
        </Link>
        <AdminNav />
      </aside>

      <div className="flex min-w-0 flex-col">
        <header className="flex items-center justify-between gap-4 border-b border-borde bg-fondo px-4 py-3 lg:px-8">
          <p className="truncate text-sm text-texto-suave">{email}</p>
          <form action={cerrarSesion}>
            <button
              type="submit"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-borde px-4 text-sm font-semibold transition hover:bg-superficie"
            >
              <LogOut size={18} />
              Salir
            </button>
          </form>
        </header>
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}