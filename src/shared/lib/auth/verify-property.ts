import "server-only";

import { createClient } from "@/shared/lib/supabase/server";
import { requireUser, type AuthResult, type AuthProfile } from "./verify-role";

export type PropertyAccess = {
  profile: AuthProfile;
  propertyId: string;
  agentId: string;
};

/**
 * Verifica que el usuario actual sea el dueno de la propiedad (agent_id == profile.id)
 * o admin (H-3.1).
 *
 * Por que: Server Actions como updateProperty, deleteProperty,
 * togglePropertyStatus hacian `.update().eq("id", propertyId)` sin verificar
 * ownership en codigo aplicativo. Aunque RLS deberia bloquearlo a nivel DB,
 * la defensa en profundidad evita que un misconfig de policy abra la puerta
 * a tampering cross-tenant entre agentes.
 *
 * Uso:
 *   const result = await requirePropertyAccess(id);
 *   if (!result.ok) return { error: result.error };
 *   // ... mutar la propiedad
 */
export async function requirePropertyAccess(
  propertyId: string
): Promise<AuthResult<PropertyAccess>> {
  const auth = await requireUser();
  if (!auth.ok) return auth;

  const supabase = await createClient();
  const { data: property } = await supabase
    .from("properties")
    .select("id, agent_id")
    .eq("id", propertyId)
    .maybeSingle();

  if (!property) {
    return { ok: false, error: "FORBIDDEN" };
  }

  const isOwner = property.agent_id === auth.data.id;
  const isAdmin = auth.data.role === "admin";

  if (!isOwner && !isAdmin) {
    return { ok: false, error: "FORBIDDEN" };
  }

  return {
    ok: true,
    data: {
      profile: auth.data,
      propertyId: property.id,
      agentId: property.agent_id,
    },
  };
}
