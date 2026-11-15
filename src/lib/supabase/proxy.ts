import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Refresca la sesión y bloquea /admin a quien no tenga sesión válida.
// Aquí solo se comprueba que HAYA sesión; el rol de admin se verifica
// en el servidor (exigirAdmin) y en la base de datos (RLS).
export async function actualizarSesion(request: NextRequest) {
  let respuesta = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          respuesta = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            respuesta.cookies.set(name, value, options)
          );
          // Cabeceras anti-caché: evitan que una CDN guarde una sesión
          Object.entries(headers).forEach(([clave, valor]) =>
            respuesta.headers.set(clave, valor)
          );
        },
      },
    }
  );

  // No pongas código entre createServerClient y getClaims()
  const { data } = await supabase.auth.getClaims();

  if (!data?.claims) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return respuesta;
}