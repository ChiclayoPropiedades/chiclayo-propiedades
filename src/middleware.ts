import { type NextRequest } from "next/server";
import { updateSession } from "@/shared/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  // IMPORTANTE: solo correr middleware en rutas que realmente necesitan
  // validacion de sesion. Correrlo en rutas publicas marca la pagina como
  // dynamic y anula cualquier ISR/cache estatico, penalizando TTFB.
  //
  // Publicas (excluidas del middleware): /, /propiedades, /ranking, /blog,
  // /capacitaciones, /servicios, /contacto, /privacidad, /terminos, etc.
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/login",
    "/signup",
    "/password-recovery",
    "/verify-email",
  ],
};
