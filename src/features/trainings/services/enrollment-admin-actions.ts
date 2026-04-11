"use server";

import { createAdminClient } from "@/shared/lib/supabase/admin";
import { revalidatePath } from "next/cache";

// ─── Admin: Confirmar pago de inscripcion ───────────────────────────────────

export async function confirmEnrollmentPayment(
  enrollmentId: string
): Promise<{ success?: boolean; error?: string }> {
  const adminSupabase = createAdminClient();

  const { error } = await adminSupabase
    .from("training_enrollments")
    .update({
      payment_status: "completed",
    })
    .eq("id", enrollmentId)
    .eq("payment_status", "pending");

  if (error) return { error: error.message };

  revalidatePath("/admin/capacitaciones");
  revalidatePath("/admin/finanzas");
  return { success: true };
}

// ─── Admin: Rechazar inscripcion ────────────────────────────────────────────

export async function rejectEnrollment(
  enrollmentId: string
): Promise<{ success?: boolean; error?: string }> {
  const adminSupabase = createAdminClient();

  const { error } = await adminSupabase
    .from("training_enrollments")
    .update({
      payment_status: "failed",
    })
    .eq("id", enrollmentId)
    .eq("payment_status", "pending");

  if (error) return { error: error.message };

  revalidatePath("/admin/capacitaciones");
  revalidatePath("/admin/finanzas");
  return { success: true };
}
