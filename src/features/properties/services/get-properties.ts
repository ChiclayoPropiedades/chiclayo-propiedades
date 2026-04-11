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
  return (data ?? []).filter((p) => {
    const agent = Array.isArray(p.agent) ? p.agent[0] : p.agent;
    return agent?.is_active !== false;
  }) as Property[];
}

export async function getFeaturedProperties(): Promise<Property[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("properties")
    .select("*, property_images(*), agent:profiles!agent_id(is_active)")
    .eq("is_active", true)
    .eq("featured", true)
    .order("created_at", { ascending: false })
    .limit(6);
  if (error) throw error;

  return (data ?? []).filter((p) => {
    const agent = Array.isArray(p.agent) ? p.agent[0] : p.agent;
    return agent?.is_active !== false;
  }) as Property[];
}

export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("properties")
    .select(
      "*, property_images(*), agent:profiles!agent_id(id, full_name, phone, avatar_url, is_active)"
    )
    .eq("slug", slug)
    .single();
  if (error) return null;

  // Si el agente está inactivo, no mostrar la propiedad
  const agent = Array.isArray(data.agent) ? data.agent[0] : data.agent;
  if (agent?.is_active === false) return null;

  return data as Property;
}
