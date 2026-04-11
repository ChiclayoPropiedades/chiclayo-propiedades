"use server";

import { createClient } from "@/shared/lib/supabase/server";
import { createAdminClient } from "@/shared/lib/supabase/admin";
import { revalidatePath } from "next/cache";

// ─── Usuario solicita ser agente ────────────────────────────────────────────

export async function requestRoleUpgrade(
  reason?: string
): Promise<{ success?: boolean; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "No autenticado" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, role")
    .eq("user_id", user.id)
    .single();
  if (!profile) return { error: "Perfil no encontrado" };

  if (profile.role === "agent" || profile.role === "admin") {
    return { error: "Ya eres agente o administrador" };
  }

  // Verificar si ya tiene solicitud pendiente
  const { data: existing } = await supabase
    .from("role_upgrade_requests")
    .select("id")
    .eq("profile_id", profile.id)
    .eq("status", "pending")
    .maybeSingle();

  if (existing) return { error: "Ya tienes una solicitud pendiente" };

  const { error } = await supabase.from("role_upgrade_requests").insert({
    profile_id: profile.id,
    from_role: profile.role,
    to_role: "agent",
    reason: reason?.trim() || null,
  });

  if (error) return { error: error.message };
  return { success: true };
}

// ─── Verificar si usuario tiene solicitud pendiente ─────────────────────────

export async function hasPendingRoleUpgrade(): Promise<{
  pending: boolean;
  requestId?: string;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { pending: false };

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();
  if (!profile) return { pending: false };

  const { data } = await supabase
    .from("role_upgrade_requests")
    .select("id")
    .eq("profile_id", profile.id)
    .eq("status", "pending")
    .maybeSingle();

  return { pending: Boolean(data), requestId: data?.id };
}

// ─── Admin: Obtener solicitudes pendientes ──────────────────────────────────

export async function getPendingRoleUpgrades() {
  const adminSupabase = createAdminClient();

  const { data } = await adminSupabase
    .from("role_upgrade_requests")
    .select(
      "id, profile_id, from_role, to_role, reason, status, created_at, user:profiles!profile_id(full_name, phone, role)"
    )
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  return (data ?? []).map((r) => {
    const user = Array.isArray(r.user) ? r.user[0] : r.user;
    return {
      ...r,
      user_name: user?.full_name ?? "Sin nombre",
      user_phone: user?.phone ?? null,
      user_role: user?.role ?? "user",
    };
  });
}

// ─── Admin: Obtener solicitudes de un usuario ───────────────────────────────

export async function getUserRoleUpgradeRequests(profileId: string) {
  const adminSupabase = createAdminClient();

  const { data } = await adminSupabase
    .from("role_upgrade_requests")
    .select("id, from_role, to_role, reason, status, created_at, reviewed_at")
    .eq("profile_id", profileId)
    .order("created_at", { ascending: false });

  return data ?? [];
}

// ─── Admin: Aprobar solicitud ───────────────────────────────────────────────

export async function approveRoleUpgrade(
  requestId: string
): Promise<{ success?: boolean; error?: string }> {
  const adminSupabase = createAdminClient();

  // Obtener solicitud
  const { data: request } = await adminSupabase
    .from("role_upgrade_requests")
    .select("id, profile_id, to_role")
    .eq("id", requestId)
    .eq("status", "pending")
    .single();

  if (!request) return { error: "Solicitud no encontrada o ya procesada" };

  // Obtener profile_id del admin que aprueba
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let adminProfileId: string | null = null;
  if (user) {
    const { data: adminProfile } = await adminSupabase
      .from("profiles")
      .select("id")
      .eq("user_id", user.id)
      .single();
    adminProfileId = adminProfile?.id ?? null;
  }

  // Cambiar rol del usuario
  const { error: roleError } = await adminSupabase
    .from("profiles")
    .update({ role: request.to_role })
    .eq("id", request.profile_id);

  if (roleError) return { error: roleError.message };

  // Actualizar solicitud
  const { error } = await adminSupabase
    .from("role_upgrade_requests")
    .update({
      status: "approved",
      reviewed_by: adminProfileId,
      reviewed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", requestId);

  if (error) return { error: error.message };

  revalidatePath("/admin/usuarios");
  return { success: true };
}

// ─── Admin: Rechazar solicitud ──────────────────────────────────────────────

export async function rejectRoleUpgrade(
  requestId: string
): Promise<{ success?: boolean; error?: string }> {
  const adminSupabase = createAdminClient();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let adminProfileId: string | null = null;
  if (user) {
    const { data: adminProfile } = await adminSupabase
      .from("profiles")
      .select("id")
      .eq("user_id", user.id)
      .single();
    adminProfileId = adminProfile?.id ?? null;
  }

  const { error } = await adminSupabase
    .from("role_upgrade_requests")
    .update({
      status: "rejected",
      reviewed_by: adminProfileId,
      reviewed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", requestId)
    .eq("status", "pending");

  if (error) return { error: error.message };

  revalidatePath("/admin/usuarios");
  return { success: true };
}
