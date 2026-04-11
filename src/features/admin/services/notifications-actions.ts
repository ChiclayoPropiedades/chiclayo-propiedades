"use server";

import { createAdminClient } from "@/shared/lib/supabase/admin";

export interface AdminNotifications {
  pendingRoleUpgrades: number;
  pendingPublicationRequests: number;
  pendingEnrollments: number;
  pendingSales: number;
  newLeads: number;
}

export async function getAdminNotifications(): Promise<AdminNotifications> {
  const adminSupabase = createAdminClient();

  const [
    { count: roleUpgrades },
    { count: pubRequests },
    { count: enrollments },
    { count: sales },
    { count: leads },
  ] = await Promise.all([
    adminSupabase
      .from("role_upgrade_requests")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending"),
    adminSupabase
      .from("publication_requests")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending"),
    adminSupabase
      .from("training_enrollments")
      .select("id", { count: "exact", head: true })
      .eq("payment_status", "pending"),
    adminSupabase
      .from("properties")
      .select("id", { count: "exact", head: true })
      .eq("status", "sold")
      .eq("sale_approved", false),
    adminSupabase
      .from("inquiries")
      .select("id", { count: "exact", head: true })
      .eq("status", "new"),
  ]);

  return {
    pendingRoleUpgrades: roleUpgrades ?? 0,
    pendingPublicationRequests: pubRequests ?? 0,
    pendingEnrollments: enrollments ?? 0,
    pendingSales: sales ?? 0,
    newLeads: leads ?? 0,
  };
}
