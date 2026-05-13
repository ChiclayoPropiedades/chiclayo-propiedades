import { createClient } from "@/shared/lib/supabase/server";
import { createAdminClient } from "@/shared/lib/supabase/admin";
import { ensureProfileExists } from "@/features/auth/services/ensure-profile";
import { NextResponse } from "next/server";

/**
 * Valida que `next` sea un path interno seguro (mitiga open redirect H-1.3).
 * Solo acepta paths que empiezan con `/` y NO con `//` o `/\` (protocol-relative).
 * Cualquier valor invalido cae al default `/dashboard`.
 */
function safeNextPath(raw: string | null): string {
  const fallback = "/dashboard";
  if (!raw) return fallback;
  // Bloquea protocol-relative (//evil.com, /\\evil.com) y absolute URLs.
  if (!raw.startsWith("/")) return fallback;
  if (raw.startsWith("//") || raw.startsWith("/\\")) return fallback;
  // Bloquea cualquier intento de embed de protocolo.
  if (/[\r\n\t]/.test(raw)) return fallback;
  return raw;
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = safeNextPath(searchParams.get("next"));

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=auth`);
  }

  const supabase = await createClient();
  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
  if (exchangeError) {
    return NextResponse.redirect(`${origin}/login?error=auth`);
  }

  // Tras intercambiar el code, validamos que el profile exista y esté activo.
  // Esto cubre el edge case en que el trigger on_auth_user_created falle.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(`${origin}/login?error=auth`);
  }

  // Lectura con service role para no depender de RLS aquí.
  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("id, is_active")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!profile) {
    // Red de seguridad: crear profile si el trigger falló.
    const result = await ensureProfileExists({
      id: user.id,
      email: user.email,
      user_metadata: user.user_metadata,
    });
    if (!result.ok) {
      return NextResponse.redirect(`${origin}/login?error=profile`);
    }
  } else if (profile.is_active === false) {
    // Cuenta desactivada: cerrar sesión y avisar.
    await supabase.auth.signOut();
    return NextResponse.redirect(`${origin}/login?error=inactive`);
  }

  return NextResponse.redirect(`${origin}${next}`);
}
