"use server";

import { createAdminClient } from "@/shared/lib/supabase/admin";

interface AuthUserLike {
  id: string;
  email?: string | null;
  user_metadata?: {
    full_name?: string;
    phone?: string;
    role?: string;
  } | null;
}

/**
 * Red de seguridad: garantiza que existe un profile para el user dado.
 *
 * Idempotente: si el profile ya existe (creado por el trigger
 * on_auth_user_created), no hace nada gracias a ON CONFLICT (user_id).
 *
 * Se invoca desde el callback de auth tras `exchangeCodeForSession` para
 * cubrir el caso edge en que el trigger no haya creado el profile.
 */
export async function ensureProfileExists(user: AuthUserLike): Promise<{
  ok: boolean;
  created: boolean;
  error?: string;
}> {
  const supabase = createAdminClient();

  // Si ya existe, no tocar.
  const { data: existing } = await supabase
    .from("profiles")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    return { ok: true, created: false };
  }

  const meta = user.user_metadata ?? {};
  const fullName = (meta.full_name ?? "").trim() || (user.email?.split("@")[0] ?? "Usuario");
  const phone = (meta.phone ?? "").trim() || null;
  const role = ["user", "agent", "admin"].includes(meta.role ?? "") ? meta.role! : "user";

  const { error } = await supabase.from("profiles").insert({
    user_id: user.id,
    full_name: fullName,
    phone,
    role,
  });

  if (error) {
    // Si fue un conflict (race con el trigger), está bien.
    if (error.code === "23505") {
      return { ok: true, created: false };
    }
    return { ok: false, created: false, error: error.message };
  }

  return { ok: true, created: true };
}
