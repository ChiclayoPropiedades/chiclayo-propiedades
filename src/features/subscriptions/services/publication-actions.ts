"use server";

import { createClient } from "@/shared/lib/supabase/server";
import { createAdminClient } from "@/shared/lib/supabase/admin";
import { revalidatePath } from "next/cache";

// ─── Crear solicitud de publicación ─────────────────────────────────────────

export async function createPublicationRequest(
  planType: "basic" | "advanced",
  planName: string,
  planPrice: number,
  currency: string
): Promise<{ success?: boolean; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "No autenticado" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();
  if (!profile) return { error: "Perfil no encontrado" };

  // Verificar si ya tiene solicitud pendiente
  const { data: existing } = await supabase
    .from("publication_requests")
    .select("id")
    .eq("profile_id", profile.id)
    .eq("status", "pending")
    .maybeSingle();

  if (existing) return { error: "Ya tienes una solicitud pendiente" };

  const { error } = await supabase.from("publication_requests").insert({
    profile_id: profile.id,
    plan_type: planType,
    plan_name: planName,
    plan_price: planPrice,
    currency,
  });

  if (error) return { error: error.message };
  return { success: true };
}

// ─── Admin: Obtener solicitudes pendientes ──────────────────────────────────

export async function getPendingPublicationRequests() {
  const adminSupabase = createAdminClient();

  const { data } = await adminSupabase
    .from("publication_requests")
    .select(
      "id, profile_id, plan_type, plan_name, plan_price, currency, status, created_at, user:profiles!profile_id(full_name, phone)"
    )
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  return (data ?? []).map((r) => {
    const user = Array.isArray(r.user) ? r.user[0] : r.user;
    return {
      ...r,
      user_name: user?.full_name ?? "Sin nombre",
      user_phone: user?.phone ?? null,
    };
  });
}

// ─── Admin: Obtener todas las solicitudes ───────────────────────────────────

export async function getAllPublicationRequests() {
  const adminSupabase = createAdminClient();

  const { data } = await adminSupabase
    .from("publication_requests")
    .select(
      "id, profile_id, plan_type, plan_name, plan_price, currency, status, created_at, user:profiles!profile_id(full_name, phone)"
    )
    .order("created_at", { ascending: false });

  return (data ?? []).map((r) => {
    const user = Array.isArray(r.user) ? r.user[0] : r.user;
    return {
      ...r,
      user_name: user?.full_name ?? "Sin nombre",
      user_phone: user?.phone ?? null,
    };
  });
}

// ─── Admin: Aprobar solicitud ───────────────────────────────────────────────

export async function approvePublicationRequest(
  requestId: string
): Promise<{ success?: boolean; error?: string }> {
  const adminSupabase = createAdminClient();

  const { error } = await adminSupabase
    .from("publication_requests")
    .update({ status: "approved", updated_at: new Date().toISOString() })
    .eq("id", requestId);

  if (error) return { error: error.message };

  revalidatePath("/admin/usuarios");
  revalidatePath("/admin/propiedades");
  return { success: true };
}

// ─── Admin: Rechazar solicitud ──────────────────────────────────────────────

export async function rejectPublicationRequest(
  requestId: string
): Promise<{ success?: boolean; error?: string }> {
  const adminSupabase = createAdminClient();

  const { error } = await adminSupabase
    .from("publication_requests")
    .update({ status: "rejected", updated_at: new Date().toISOString() })
    .eq("id", requestId);

  if (error) return { error: error.message };

  revalidatePath("/admin/usuarios");
  return { success: true };
}

// ─── Verificar si usuario tiene plan aprobado ───────────────────────────────

export async function hasApprovedPlan(profileId: string): Promise<{
  approved: boolean;
  plan?: { type: string; name: string; maxPhotos: number };
}> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("publication_requests")
    .select("plan_type, plan_name")
    .eq("profile_id", profileId)
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!data) return { approved: false };

  // Leer límite de fotos desde configuración
  const { data: photoSettings } = await supabase
    .from("platform_settings")
    .select("key, value")
    .in("key", ["user_pub_basic_photos", "user_pub_advanced_photos"]);

  const ps: Record<string, string> = {};
  for (const row of photoSettings ?? []) ps[row.key] = row.value;

  const maxPhotos = data.plan_type === "advanced"
    ? parseInt(ps.user_pub_advanced_photos ?? "10")
    : parseInt(ps.user_pub_basic_photos ?? "1");

  return {
    approved: true,
    plan: {
      type: data.plan_type,
      name: data.plan_name,
      maxPhotos,
    },
  };
}
