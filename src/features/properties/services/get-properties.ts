import { cache } from "react";
import { createPublicClient } from "@/shared/lib/supabase/server";
import { Property, PropertyFilters } from "../types";

// Obtener IDs de perfiles que deben estar ocultos en la web pública.
// Envuelto en React.cache() para deduplicar dentro del mismo request.
const getHiddenProfileIds = cache(async (): Promise<{
  hiddenProfileIds: Set<string>;
  expiredPropertyIds: Set<string>;
}> => {
  const { createClient: createServiceClient } = await import("@supabase/supabase-js");
  const adminSb = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Ejecutar todas las queries en paralelo
  const [
    { data: inactiveProfiles },
    { data: agents },
    { data: activeSubs },
    { data: expiredPubs },
  ] = await Promise.all([
    adminSb.from("profiles").select("id").eq("is_active", false),
    adminSb.from("profiles").select("id").eq("role", "agent").eq("is_active", true),
    adminSb
      .from("agent_subscriptions")
      .select("profile_id")
      .eq("status", "active")
      .gte("expires_at", new Date().toISOString()),
    adminSb
      .from("publication_requests")
      .select("property_id")
      .eq("status", "approved")
      .eq("used", true)
      .not("property_id", "is", null)
      .lt("expires_at", new Date().toISOString()),
  ]);

  const activeSubIds = new Set((activeSubs ?? []).map((s) => s.profile_id));
  const expiredAgents = (agents ?? []).filter((a) => !activeSubIds.has(a.id));

  const hiddenIds = new Set<string>();
  for (const p of inactiveProfiles ?? []) hiddenIds.add(p.id);
  for (const a of expiredAgents) hiddenIds.add(a.id);

  const expiredPropertyIds = new Set<string>();
  for (const p of expiredPubs ?? []) {
    if (p.property_id) expiredPropertyIds.add(p.property_id);
  }

  return { hiddenProfileIds: hiddenIds, expiredPropertyIds };
});

export async function getProperties(filters?: PropertyFilters): Promise<Property[]> {
  const supabase = createPublicClient();
  let query = supabase
    .from("properties")
    .select("id, agent_id, title, slug, price, currency, operation, type, bedrooms, bathrooms, area_m2, address, district, city, status, featured, created_at, property_images(id, url, alt_text, is_cover, display_order)")
    .eq("is_active", true);

  if (filters?.search) query = query.ilike("title", `%${filters.search}%`);
  if (filters?.operation) query = query.eq("operation", filters.operation);
  if (filters?.type) query = query.eq("type", filters.type);
  if (filters?.minPrice) query = query.gte("price", filters.minPrice);
  if (filters?.maxPrice) query = query.lte("price", filters.maxPrice);
  if (filters?.district) query = query.eq("district", filters.district);

  const { data, error } = await query.order("created_at", { ascending: false });
  if (error) throw error;

  const { hiddenProfileIds, expiredPropertyIds } = await getHiddenProfileIds();
  return ((data ?? []) as Property[]).filter(
    (p) => !hiddenProfileIds.has(p.agent_id) && !expiredPropertyIds.has(p.id)
  );
}

export async function getFeaturedProperties(): Promise<Property[]> {
  const supabase = createPublicClient();

  // Primero traer destacadas
  const { data: featured } = await supabase
    .from("properties")
    .select("id, agent_id, title, slug, price, currency, operation, type, bedrooms, bathrooms, area_m2, address, district, city, status, featured, created_at, property_images(id, url, alt_text, is_cover, display_order)")
    .eq("is_active", true)
    .eq("featured", true)
    .order("created_at", { ascending: false })
    .limit(6);

  const { hiddenProfileIds, expiredPropertyIds } = await getHiddenProfileIds();

  let results = ((featured ?? []) as Property[]).filter(
    (p) => !hiddenProfileIds.has(p.agent_id) && !expiredPropertyIds.has(p.id)
  );

  // Si hay menos de 6 destacadas, completar con las más recientes
  if (results.length < 6) {
    const featuredIds = new Set(results.map((p) => p.id));
    const { data: recent } = await supabase
      .from("properties")
      .select("id, agent_id, title, slug, price, currency, operation, type, bedrooms, bathrooms, area_m2, address, district, city, status, featured, created_at, property_images(id, url, alt_text, is_cover, display_order)")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(12);

    const recentFiltered = ((recent ?? []) as Property[]).filter(
      (p) =>
        !featuredIds.has(p.id) &&
        !hiddenProfileIds.has(p.agent_id) &&
        !expiredPropertyIds.has(p.id)
    );

    results = [...results, ...recentFiltered].slice(0, 6);
  }

  return results;
}

export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("properties")
    .select(
      "*, property_images(*), agent:profiles!agent_id(id, full_name, phone, avatar_url)"
    )
    .eq("slug", slug)
    .single();
  if (error) return null;

  const { hiddenProfileIds, expiredPropertyIds } = await getHiddenProfileIds();
  if (hiddenProfileIds.has(data.agent_id)) return null;
  if (expiredPropertyIds.has(data.id)) return null;

  return data as Property;
}
