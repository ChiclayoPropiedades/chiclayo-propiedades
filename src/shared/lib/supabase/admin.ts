import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Creates a Supabase client with service_role privileges.
 * Server-only — never import in client components.
 *
 * Fail-loud (H-1.7): si SUPABASE_SERVICE_ROLE_KEY falta, lanza error en lugar
 * de degradar silenciosamente al anon key. El fallback antiguo enmascaraba un
 * misconfig: los admin actions corrian con permisos de anon y fallaban en
 * runtime con "permission denied" sin contexto. Ahora el deploy / la primera
 * llamada falla inmediatamente con un mensaje claro.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) {
    throw new Error(
      "[createAdminClient] Missing NEXT_PUBLIC_SUPABASE_URL env var. " +
        "Set it in Vercel Environment Variables and redeploy."
    );
  }
  if (!serviceKey) {
    throw new Error(
      "[createAdminClient] Missing SUPABASE_SERVICE_ROLE_KEY env var. " +
        "This is required to bypass RLS in admin operations. " +
        "Set it in Vercel Environment Variables and redeploy."
    );
  }

  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
