"use server";

import { createClient } from "@/shared/lib/supabase/server";
import { revalidatePath } from "next/cache";

// ─── Types ──────────────────────────────────────────────────────────────────

interface PlatformSettings {
  commission_percentage: string;
  commission_currency: string;
  usd_to_pen_rate: string;
  agent_subscription_price: string;
  agent_subscription_currency: string;
  free_subscription_enabled: string;
  whatsapp_payment_enabled: string;
  whatsapp_payment_number: string;
  whatsapp_payment_message: string;
  user_pub_enabled: string;
  user_pub_basic_price: string;
  user_pub_basic_name: string;
  user_pub_advanced_price: string;
  user_pub_advanced_name: string;
  user_pub_advanced_extras: string;
  user_pub_currency: string;
}

export interface EmailSettings {
  email_provider: string;
  brevo_api_key: string;
  brevo_from_email: string;
  gmail_client_id: string;
  gmail_client_secret: string;
  gmail_refresh_token: string;
  gmail_from_email: string;
}

// ─── Platform Settings ──────────────────────────────────────────────────────

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
    free_subscription_enabled: "true",
    whatsapp_payment_enabled: "true",
    whatsapp_payment_number: "51928216206",
    whatsapp_payment_message: "Hola, quiero realizar el pago de mi suscripción de agente en Chiclayo Propiedades",
    user_pub_enabled: "true",
    user_pub_basic_price: "50",
    user_pub_basic_name: "Básica",
    user_pub_advanced_price: "100",
    user_pub_advanced_name: "Avanzada",
    user_pub_advanced_extras: "Mención en podcast de TikTok",
    user_pub_currency: "PEN",
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
    {
      key: "free_subscription_enabled",
      value: formData.get("free_subscription_enabled") as string ?? "false",
    },
    {
      key: "whatsapp_payment_enabled",
      value: formData.get("whatsapp_payment_enabled") as string ?? "false",
    },
    {
      key: "whatsapp_payment_number",
      value: formData.get("whatsapp_payment_number") as string,
    },
    {
      key: "whatsapp_payment_message",
      value: formData.get("whatsapp_payment_message") as string,
    },
    {
      key: "user_pub_enabled",
      value: formData.get("user_pub_enabled") as string ?? "false",
    },
    {
      key: "user_pub_basic_price",
      value: formData.get("user_pub_basic_price") as string,
    },
    {
      key: "user_pub_basic_name",
      value: formData.get("user_pub_basic_name") as string,
    },
    {
      key: "user_pub_advanced_price",
      value: formData.get("user_pub_advanced_price") as string,
    },
    {
      key: "user_pub_advanced_name",
      value: formData.get("user_pub_advanced_name") as string,
    },
    {
      key: "user_pub_advanced_extras",
      value: formData.get("user_pub_advanced_extras") as string,
    },
    {
      key: "user_pub_currency",
      value: formData.get("user_pub_currency") as string,
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

// ─── Email Settings ─────────────────────────────────────────────────────────

export async function getEmailSettings(): Promise<EmailSettings> {
  const supabase = await createClient();

  const emailKeys = [
    "email_provider",
    "brevo_api_key",
    "brevo_from_email",
    "gmail_client_id",
    "gmail_client_secret",
    "gmail_refresh_token",
    "gmail_from_email",
  ];

  const { data } = await supabase
    .from("platform_settings")
    .select("key, value")
    .in("key", emailKeys);

  const settings: EmailSettings = {
    email_provider: "",
    brevo_api_key: "",
    brevo_from_email: "info@chiclayopropiedades.com",
    gmail_client_id: "",
    gmail_client_secret: "",
    gmail_refresh_token: "",
    gmail_from_email: "propiedadeschiclayo01@gmail.com",
  };

  for (const row of data ?? []) {
    if (row.key in settings) {
      settings[row.key as keyof EmailSettings] = row.value;
    }
  }

  return settings;
}

export async function updateEmailSettings(
  formData: FormData
): Promise<{ success?: boolean; error?: string }> {
  const supabase = await createClient();

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

  const keys = [
    "email_provider",
    "brevo_api_key",
    "brevo_from_email",
    "gmail_client_id",
    "gmail_client_secret",
    "gmail_refresh_token",
    "gmail_from_email",
  ];

  for (const key of keys) {
    const value = formData.get(key) as string;
    if (value !== null && value !== undefined) {
      await supabase
        .from("platform_settings")
        .upsert(
          { key, value, updated_at: new Date().toISOString() },
          { onConflict: "key" }
        );
    }
  }

  // Limpiar cache del email provider
  const { clearEmailCache } = await import("@/shared/lib/resend");
  clearEmailCache();

  revalidatePath("/admin/configuracion");
  return { success: true };
}

// ─── Email Settings (para el email provider, sin auth) ──────────────────────

export async function getEmailSettingsForProvider(): Promise<EmailSettings> {
  // Esta función se usa internamente por el email provider
  // Usa service role para no depender de la sesión del usuario
  const { createClient: createServiceClient } = await import("@supabase/supabase-js");

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createServiceClient(url, key);

  const emailKeys = [
    "email_provider",
    "brevo_api_key",
    "brevo_from_email",
    "gmail_client_id",
    "gmail_client_secret",
    "gmail_refresh_token",
    "gmail_from_email",
  ];

  const { data } = await supabase
    .from("platform_settings")
    .select("key, value")
    .in("key", emailKeys);

  const settings: EmailSettings = {
    email_provider: "",
    brevo_api_key: "",
    brevo_from_email: "info@chiclayopropiedades.com",
    gmail_client_id: "",
    gmail_client_secret: "",
    gmail_refresh_token: "",
    gmail_from_email: "propiedadeschiclayo01@gmail.com",
  };

  for (const row of data ?? []) {
    if (row.key in settings) {
      settings[row.key as keyof EmailSettings] = row.value;
    }
  }

  return settings;
}
