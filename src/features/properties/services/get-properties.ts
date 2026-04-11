import { createClient } from "@/shared/lib/supabase/server";
import { Property, PropertyFilters } from "../types";

// Obtener IDs de perfiles que deben estar ocultos en la web pública
async function getHiddenProfileIds(): Promise<Set<string>> {
  const { createClient: createServiceClient } = await import("@supabase/supabase-js");
  const adminSb = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // 1. Perfiles inactivos
  const { data: inactiveProfiles } = await adminSb
    .from("profiles")
    .select("id")
    .eq("is_active", false);

  // 2. Agentes con suscripción vencida (rol agent sin suscripción activa)
  const { data: agents } = await adminSb
    .from("profiles")
    .select("id")
    .eq("role", "agent")
    .eq("is_active", true);

  const { data: activeSubs } = await adminSb
    .from("agent_subscriptions")
    .select("profile_id")
    .eq("status", "active")
    .gte("expires_at", new Date().toISOString());

  const activeSubIds = new Set((activeSubs ?? []).map((s) => s.profile_id));
  const expiredAgents = (agents ?? []).filter((a) => !activeSubIds.has(a.id));

  const hiddenIds = new Set<string>();
  for (const p of inactiveProfiles ?? []) hiddenIds.add(p.id);
  for (const a of expiredAgents) hiddenIds.add(a.id);

  return hiddenIds;
}

export async function getProperties(filters?: PropertyFilters): Promise<Property[]> {
  const supabase = await createClient();
  let query = supabase
    .from("properties")
    .select("*, property_images(*), agent:profiles!agent_id(is_active)")
    .eq("is_active", true);

  if (filters?.search) query = query.ilike("title", `%${filters.search}%`);
  if (filters?.operation) query = query.eq("operation", filters.operation);
  if (filters?.type) query = query.eq("type", filters.type);
  if (filters?.minPrice) query = query.gte("price", filters.minPrice);
  if (filters?.maxPrice) query = query.lte("price", filters.maxPrice);
  if (filters?.district) query = query.eq("district", filters.district);

  const { data, error } = await query.order("created_at", { ascending: false });
  if (error) throw error;

  const hiddenIds = await getHiddenProfileIds();
  return ((data ?? []) as Property[]).filter((p) => !hiddenIds.has(p.agent_id));
}

export async function getFeaturedProperties(): Promise<Property[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("properties")
    .select("*, property_images(*)")
    .eq("is_active", true)
    .eq("featured", true)
    .order("created_at", { ascending: false })
    .limit(6);
  if (error) throw error;

  const hiddenIds = await getHiddenProfileIds();
  return ((data ?? []) as Property[]).filter((p) => !hiddenIds.has(p.agent_id));
}

export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("properties")
    .select(
      "*, property_images(*), agent:profiles!agent_id(id, full_name, phone, avatar_url)"
    )
    .eq("slug", slug)
    .single();
  if (error) return null;

  const hiddenIds = await getHiddenProfileIds();
  if (hiddenIds.has(data.agent_id)) return null;

  return data as Property;
}
