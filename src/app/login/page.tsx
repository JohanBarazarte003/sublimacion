import type { Metadata } from "next";
import Button from "@/components/ui/Button";
import Logo from "@/components/ui/Logo";
import { iniciarSesion } from "@/lib/auth/acciones";

export const metadata: Metadata = {
  title: "Acceso",
  robots: { index: false, follow: false },
};

const MENSAJES: Record<string, string> = {
  credenciales: "Correo o contraseña incorrectos.",
  permiso: "Esta cuenta no tiene acceso al panel.",
  datos: "Completa el correo y la contraseña.",
};

const campo =
  "mt-1 block min-h-[48px] w-full rounded-2xl border border-borde bg-fondo px-4 text-base outline-none transition focus:border-primario focus:ring-4 focus:ring-primario/15";

export default async function Login({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const mensaje = error ? MENSAJES[error] : undefined;

  return (
    <main className="grid min-h-screen place-items-center bg-superficie px-4 py-10">
      <div className="w-full max-w-sm rounded-tarjeta border border-borde bg-fondo p-8 shadow-tarjeta">
        <Logo />
        <h1 className="mt-6 text-2xl font-extrabold">Acceso al panel</h1>
        <p className="mt-1 text-sm text-texto-suave">Solo para el equipo.</p>

        <form action={iniciarSesion} className="mt-6 flex flex-col gap-4">
          <label className="text-sm font-semibold">
            Correo
            <input
              name="correo"
              type="email"
              required
              autoComplete="email"
              maxLength={254}
              className={campo}
            />
          </label>

          <label className="text-sm font-semibold">
            Contraseña
            <input
              name="clave"
              type="password"
              required
              autoComplete="current-password"
              maxLength={200}
              className={campo}
            />
          </label>

          {mensaje && (
            <p role="alert" className="text-sm font-medium text-error">
              {mensaje}
            </p>
          )}

          <Button type="submit">Entrar</Button>
        </form>
      </div>
    </main>
  );
}