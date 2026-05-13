import "server-only";

import { createClient } from "@/shared/lib/supabase/server";

/**
 * Profile minimo cargado tras verificacion de auth.
 * Mantiene shape consistente entre helpers para reuso.
 */
export type AuthProfile = {
  id: string;
  user_id: string;
  role: "user" | "agent" | "admin";
};

/**
 * Resultado standard de los helpers de verificacion.
 * `error` usa codes estables para que las Server Actions puedan mapear a
 * mensajes de UI sin acoplarse a strings.
 */
export type AuthResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: "UNAUTHENTICATED" | "FORBIDDEN" | "PROFILE_NOT_FOUND" };

/**
 * Verifica que haya una sesion valida y retorna el profile asociado.
 * Para usar al inicio de Server Actions que requieren usuario autenticado.
 */
export async function requireUser(): Promise<AuthResult<AuthProfile>> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "UNAUTHENTICATED" };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, user_id, role")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!profile) {
    return { ok: false, error: "PROFILE_NOT_FOUND" };
  }

  return { ok: true, data: profile as AuthProfile };
}

/**
 * Verifica que el usuario sea admin (H-3.2).
 * Pensado para usar al inicio de cada admin Server Action.
 */
export async function requireAdmin(): Promise<AuthResult<AuthProfile>> {
  const result = await requireUser();
  if (!result.ok) return result;

  if (result.data.role !== "admin") {
    return { ok: false, error: "FORBIDDEN" };
  }

  return result;
}

/**
 * Verifica que el usuario sea agent o admin (no solo user comprador).
 * Pensado para Server Actions que solo agentes/admins deben ejecutar
 * (crear propiedades, gestionar leads asignados, etc.).
 */
export async function requireAgentOrAdmin(): Promise<AuthResult<AuthProfile>> {
  const result = await requireUser();
  if (!result.ok) return result;

  if (result.data.role !== "agent" && result.data.role !== "admin") {
    return { ok: false, error: "FORBIDDEN" };
  }

  return result;
}
