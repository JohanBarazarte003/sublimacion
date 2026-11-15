import type { NextRequest } from "next/server";
import { actualizarSesion } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  return actualizarSesion(request);
}

// Solo se ejecuta en el panel: el resto del sitio queda libre de sesiones
export const config = {
  matcher: ["/admin/:path*"],
};