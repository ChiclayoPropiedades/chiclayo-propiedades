import { createClient } from "@/shared/lib/supabase/server";
import { Property, PropertyFilters } from "../types";

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

  // Filtrar propiedades de agentes inactivos/eliminados
  // Obtener IDs de perfiles inactivos via admin
  const { createClient: createServiceClient } = await import("@supabase/supabase-js");
  const adminSb = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data: inactiveProfiles } = await adminSb
    .from("profiles")
    .select("id")
    .eq("is_active", false);

  const inactiveIds = new Set((inactiveProfiles ?? []).map((p) => p.id));

  return ((data ?? []) as Property[]).filter((p) => !inactiveIds.has(p.agent_id));
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

  const { createClient: createServiceClient } = await import("@supabase/supabase-js");
  const adminSb = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data: inactiveProfiles } = await adminSb
    .from("profiles")
    .select("id")
    .eq("is_active", false);

  const inactiveIds = new Set((inactiveProfiles ?? []).map((p) => p.id));

  return ((data ?? []) as Property[]).filter((p) => !inactiveIds.has(p.agent_id));
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

  // Verificar si el agente está activo via admin client
  const { createClient: createServiceClient } = await import("@supabase/supabase-js");
  const adminSb = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data: agentProfile } = await adminSb
    .from("profiles")
    .select("is_active")
    .eq("id", data.agent_id)
    .single();

  if (agentProfile?.is_active === false) return null;

  return data as Property;
}
