"use server";

import { createClient } from "@/shared/lib/supabase/server";
import { revalidatePath } from "next/cache";

interface PlatformSettings {
  commission_percentage: string;
  commission_currency: string;
  usd_to_pen_rate: string;
  agent_subscription_price: string;
  agent_subscription_currency: string;
}

export async function getSettings(): Promise<PlatformSettings> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("platform_settings")
    .select("key, value");

  const settings: PlatformSettings = {
    commission_percentage: "5",
    commission_currency: "PEN",
    usd_to_pen_rate: "3.7",
    agent_subscription_price: "99",
    agent_subscription_currency: "PEN",
  };

  for (const row of data ?? []) {
    if (row.key in settings) {
      settings[row.key as keyof PlatformSettings] = row.value;
    }
  }

  return settings;
}

export async function updateSettings(
  formData: FormData
): Promise<{ success?: boolean; error?: string }> {
  const supabase = await createClient();

  // Verificar admin
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "No autenticado" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (profile?.role !== "admin") return { error: "No autorizado" };

  const updates = [
    {
      key: "commission_percentage",
      value: formData.get("commission_percentage") as string,
    },
    {
      key: "commission_currency",
      value: formData.get("commission_currency") as string,
    },
    {
      key: "usd_to_pen_rate",
      value: formData.get("usd_to_pen_rate") as string,
    },
    {
      key: "agent_subscription_price",
      value: formData.get("agent_subscription_price") as string,
    },
    {
      key: "agent_subscription_currency",
      value: formData.get("agent_subscription_currency") as string,
    },
  ];

  for (const { key, value } of updates) {
    if (value) {
      const { error } = await supabase
        .from("platform_settings")
        .update({ value, updated_at: new Date().toISOString() })
        .eq("key", key);

      if (error) return { error: error.message };
    }
  }

  revalidatePath("/admin/configuracion");
  revalidatePath("/admin/ranking");
  return { success: true };
}
