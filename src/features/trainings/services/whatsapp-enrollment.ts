"use server";

import { createClient } from "@/shared/lib/supabase/server";
import { revalidatePath } from "next/cache";

// ─── Crear enrollment pendiente via WhatsApp ────────────────────────────────

export async function createWhatsAppEnrollment(
  trainingId: string
): Promise<{ success?: boolean; error?: string; alreadyExists?: boolean }> {
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

  // Verificar si ya tiene enrollment (pendiente o completado)
  const { data: existing } = await supabase
    .from("training_enrollments")
    .select("id, payment_status")
    .eq("user_id", profile.id)
    .eq("training_id", trainingId)
    .in("payment_status", ["pending", "completed"])
    .maybeSingle();

  if (existing) {
    return { success: true, alreadyExists: true };
  }

  // Crear enrollment pendiente
  const { error } = await supabase.from("training_enrollments").insert({
    user_id: profile.id,
    training_id: trainingId,
    payment_status: "pending",
    enrolled_at: new Date().toISOString(),
  });

  if (error) return { error: error.message };

  revalidatePath("/dashboard/capacitaciones");
  return { success: true };
}

// ─── Verificar si ya tiene enrollment pendiente ─────────────────────────────

export async function hasExistingEnrollment(
  trainingId: string
): Promise<{ exists: boolean; status?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { exists: false };

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!profile) return { exists: false };

  const { data } = await supabase
    .from("training_enrollments")
    .select("id, payment_status")
    .eq("user_id", profile.id)
    .eq("training_id", trainingId)
    .in("payment_status", ["pending", "completed"])
    .maybeSingle();

  if (!data) return { exists: false };
  return { exists: true, status: data.payment_status };
}
