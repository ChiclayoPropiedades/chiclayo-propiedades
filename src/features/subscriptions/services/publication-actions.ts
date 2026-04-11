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
      "id, profile_id, plan_type, plan_name, plan_price, currency, status, used, expires_at, property_id, created_at, user:profiles!profile_id(full_name, phone)"
    )
    .order("created_at", { ascending: false });

  // Obtener títulos de propiedades vinculadas
  const propertyIds = (data ?? [])
    .map((r) => r.property_id)
    .filter(Boolean) as string[];

  let propertyMap = new Map<string, string>();
  if (propertyIds.length > 0) {
    const { data: properties } = await adminSupabase
      .from("properties")
      .select("id, title")
      .in("id", propertyIds);
    for (const p of properties ?? []) {
      propertyMap.set(p.id, p.title);
    }
  }

  return (data ?? []).map((r) => {
    const user = Array.isArray(r.user) ? r.user[0] : r.user;
    const isExpired = r.expires_at ? new Date(r.expires_at) < new Date() : false;
    return {
      ...r,
      user_name: user?.full_name ?? "Sin nombre",
      user_phone: user?.phone ?? null,
      is_expired: isExpired,
      property_title: r.property_id ? propertyMap.get(r.property_id) ?? null : null,
    };
  });
}

// ─── Admin: Aprobar solicitud ───────────────────────────────────────────────

export async function approvePublicationRequest(
  requestId: string
): Promise<{ success?: boolean; error?: string }> {
  const adminSupabase = createAdminClient();

  // Leer duración configurable
  const { data: durationSetting } = await adminSupabase
    .from("platform_settings")
    .select("value")
    .eq("key", "user_pub_duration_days")
    .single();

  const durationDays = parseInt(durationSetting?.value ?? "30");
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + durationDays);

  const { error } = await adminSupabase
    .from("publication_requests")
    .update({
      status: "approved",
      expires_at: expiresAt.toISOString(),
      updated_at: new Date().toISOString(),
    })
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

// ─── Admin: Eliminar solicitud + su propiedad vinculada ──────────────────────

export async function deletePublicationRequest(
  requestId: string
): Promise<{ success?: boolean; error?: string }> {
  const adminSupabase = createAdminClient();

  // Obtener propiedad vinculada
  const { data: req } = await adminSupabase
    .from("publication_requests")
    .select("property_id")
    .eq("id", requestId)
    .single();

  // Si tiene propiedad vinculada, eliminarla
  if (req?.property_id) {
    await adminSupabase.from("property_images").delete().eq("property_id", req.property_id);
    await adminSupabase.from("properties").delete().eq("id", req.property_id);
  }

  // Eliminar solicitud
  const { error } = await adminSupabase
    .from("publication_requests")
    .delete()
    .eq("id", requestId);

  if (error) return { error: error.message };

  revalidatePath("/admin/propiedades");
  revalidatePath("/admin/usuarios");
  return { success: true };
}

// ─── Admin: Desactivar solicitud (oculta propiedad sin borrar) ───────────────

export async function deactivatePublicationRequest(
  requestId: string
): Promise<{ success?: boolean; error?: string }> {
  const adminSupabase = createAdminClient();

  // Obtener propiedad vinculada
  const { data: req } = await adminSupabase
    .from("publication_requests")
    .select("property_id")
    .eq("id", requestId)
    .single();

  // Desactivar la propiedad (no eliminar)
  if (req?.property_id) {
    await adminSupabase
      .from("properties")
      .update({ is_active: false })
      .eq("id", req.property_id);
  }

  // Marcar solicitud como rechazada
  const { error } = await adminSupabase
    .from("publication_requests")
    .update({ status: "rejected", updated_at: new Date().toISOString() })
    .eq("id", requestId);

  if (error) return { error: error.message };

  revalidatePath("/admin/propiedades");
  revalidatePath("/admin/usuarios");
  return { success: true };
}

// ─── Admin: Cambiar plan de solicitud ────────────────────────────────────────

export async function changeRequestPlan(
  requestId: string,
  newPlanType: "basic" | "advanced"
): Promise<{ success?: boolean; error?: string }> {
  const adminSupabase = createAdminClient();

  // Leer precios y nombres desde config
  const { data: settings } = await adminSupabase
    .from("platform_settings")
    .select("key, value")
    .in("key", [
      "user_pub_basic_price", "user_pub_basic_name",
      "user_pub_advanced_price", "user_pub_advanced_name",
    ]);

  const ps: Record<string, string> = {};
  for (const row of settings ?? []) ps[row.key] = row.value;

  const planName = newPlanType === "advanced"
    ? (ps.user_pub_advanced_name ?? "Avanzada")
    : (ps.user_pub_basic_name ?? "Básica");
  const planPrice = newPlanType === "advanced"
    ? parseFloat(ps.user_pub_advanced_price ?? "100")
    : parseFloat(ps.user_pub_basic_price ?? "50");

  const { error } = await adminSupabase
    .from("publication_requests")
    .update({
      plan_type: newPlanType,
      plan_name: planName,
      plan_price: planPrice,
      updated_at: new Date().toISOString(),
    })
    .eq("id", requestId)
    .eq("status", "pending");

  if (error) return { error: error.message };

  revalidatePath("/admin/propiedades");
  revalidatePath("/admin/usuarios");
  return { success: true };
}

// ─── Verificar si usuario tiene plan aprobado ───────────────────────────────

export async function hasApprovedPlan(profileId: string): Promise<{
  approved: boolean;
  requestId?: string;
  plan?: { type: string; name: string; maxPhotos: number };
}> {
  const supabase = await createClient();

  // Buscar plan aprobado, no usado y no expirado
  const { data } = await supabase
    .from("publication_requests")
    .select("id, plan_type, plan_name, expires_at")
    .eq("profile_id", profileId)
    .eq("status", "approved")
    .eq("used", false)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  // Verificar si expiró
  if (data?.expires_at && new Date(data.expires_at) < new Date()) {
    return { approved: false };
  }

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
    requestId: data.id,
    plan: {
      type: data.plan_type,
      name: data.plan_name,
      maxPhotos,
    },
  };
}

// ─── Marcar plan como usado al crear propiedad ──────────────────────────────

export async function markPlanAsUsed(
  requestId: string,
  propertyId: string
): Promise<void> {
  const supabase = await createClient();
  await supabase
    .from("publication_requests")
    .update({ used: true, property_id: propertyId, updated_at: new Date().toISOString() })
    .eq("id", requestId);
}
