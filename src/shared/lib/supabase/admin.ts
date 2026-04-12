import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Creates a Supabase client with service_role privileges.
 * Server-only — never import in client components.
 *
 * Falls back to anon key if SUPABASE_SERVICE_ROLE_KEY is not set,
 * which means admin-only operations (bypassing RLS) will not work
 * but the app won't crash.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceKey) {
    console.warn(
      "[admin] SUPABASE_SERVICE_ROLE_KEY not configured — using anon key fallback. " +
      "Admin operations that bypass RLS will fail silently."
    );
    return createClient(url, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }

  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
