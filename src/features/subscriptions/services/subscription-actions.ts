"use server";

import { createClient } from "@/shared/lib/supabase/server";
import { createAdminClient } from "@/shared/lib/supabase/admin";
import { getStripe, isStripeConfigured } from "@/shared/lib/stripe";
import { revalidatePath } from "next/cache";
import type { SubscriptionStatus, SubscriptionSettings } from "../types";

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function getAuthProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, role")
    .eq("user_id", user.id)
    .maybeSingle();

  return profile ? { ...profile, user_id: user.id, email: user.email } : null;
}

// ─── Get Subscription Settings ───────────────────────────────────────────────

export async function getSubscriptionSettings(): Promise<SubscriptionSettings> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("platform_settings")
    .select("key, value")
    .in("key", ["agent_subscription_price", "agent_subscription_currency"]);

  const settings: Record<string, string> = {};
  for (const row of data ?? []) {
    settings[row.key] = row.value;
  }

  return {
    price: parseFloat(settings.agent_subscription_price ?? "99"),
    currency: settings.agent_subscription_currency ?? "PEN",
  };
}

// ─── Get Subscription Status ─────────────────────────────────────────────────

export async function getSubscriptionStatus(
  profileId: string
): Promise<SubscriptionStatus> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("agent_subscriptions")
    .select("*")
    .eq("profile_id", profileId)
    .eq("status", "active")
    .gte("expires_at", new Date().toISOString())
    .order("expires_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (data) {
    return {
      active: true,
      expiresAt: data.expires_at,
      subscription: data,
    };
  }

  return { active: false, expiresAt: null, subscription: null };
}

// ─── Create Stripe Checkout for Subscription ─────────────────────────────────

export async function createSubscriptionCheckout(): Promise<{
  url?: string;
  error?: string;
}> {
  if (!isStripeConfigured()) {
    return { error: "El sistema de pagos no está configurado. Contacta al administrador." };
  }

  const stripe = getStripe();
  if (!stripe) return { error: "Error al inicializar el sistema de pagos" };

  const profile = await getAuthProfile();
  if (!profile) return { error: "Debes iniciar sesión" };
  if (profile.role !== "agent") return { error: "Solo agentes pueden suscribirse" };

  // Verificar si ya tiene suscripción activa
  const { active } = await getSubscriptionStatus(profile.id);
  if (active) return { error: "Ya tienes una suscripción activa" };

  // Obtener precio configurable
  const settings = await getSubscriptionSettings();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: settings.currency.toLowerCase(),
            product_data: {
              name: "Suscripción Anual - Agente Inmobiliario",
              description:
                "Acceso por 1 año para publicar propiedades en Chiclayo Propiedades",
            },
            unit_amount: Math.round(settings.price * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${appUrl}/dashboard/propiedades?subscription=success`,
      cancel_url: `${appUrl}/dashboard/propiedades/nueva?subscription=cancelled`,
      customer_email: profile.email ?? undefined,
      metadata: {
        type: "agent_subscription",
        profile_id: profile.id,
      },
    });

    return { url: session.url ?? undefined };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Error al crear sesión de pago";
    return { error: message };
  }
}

// ─── Self-Activate (cuando no hay pasarela de pago configurada) ─────────────

export async function activateSubscriptionFree(): Promise<{
  success?: boolean;
  error?: string;
}> {
  const profile = await getAuthProfile();
  if (!profile) return { error: "Debes iniciar sesión" };
  if (profile.role !== "agent") return { error: "Solo agentes pueden suscribirse" };

  // Verificar si ya tiene suscripción activa
  const { active } = await getSubscriptionStatus(profile.id);
  if (active) return { error: "Ya tienes una suscripción activa" };

  const settings = await getSubscriptionSettings();
  const now = new Date();
  const expiresAt = new Date(now);
  expiresAt.setFullYear(expiresAt.getFullYear() + 1);

  const adminSupabase = createAdminClient();

  const { error } = await adminSupabase.from("agent_subscriptions").insert({
    profile_id: profile.id,
    status: "active",
    amount: 0,
    currency: settings.currency,
    started_at: now.toISOString(),
    expires_at: expiresAt.toISOString(),
    payment_date: now.toISOString(),
  });

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/propiedades");
  return { success: true };
}

// ─── Admin: Activate Subscription Manually ───────────────────────────────────

export async function activateSubscriptionManually(
  profileId: string
): Promise<{ success?: boolean; error?: string }> {
  // Verify admin
  const caller = await getAuthProfile();
  if (!caller || caller.role !== "admin") {
    return { error: "No autorizado" };
  }

  const settings = await getSubscriptionSettings();
  const now = new Date();
  const expiresAt = new Date(now);
  expiresAt.setFullYear(expiresAt.getFullYear() + 1);

  const adminSupabase = createAdminClient();

  const { error } = await adminSupabase.from("agent_subscriptions").insert({
    profile_id: profileId,
    status: "active",
    amount: settings.price,
    currency: settings.currency,
    started_at: now.toISOString(),
    expires_at: expiresAt.toISOString(),
    payment_date: now.toISOString(),
  });

  if (error) return { error: error.message };

  revalidatePath("/admin/usuarios");
  revalidatePath("/admin/finanzas");
  revalidatePath("/dashboard");
  return { success: true };
}

// ─── Admin: Extend Subscription ──────────────────────────────────────────────

export async function extendSubscription(
  profileId: string,
  amount: number,
  unit: "hours" | "days" | "months" | "years"
): Promise<{ success?: boolean; error?: string }> {
  const caller = await getAuthProfile();
  if (!caller || caller.role !== "admin") {
    return { error: "No autorizado" };
  }

  const adminSupabase = createAdminClient();

  // Buscar suscripción activa
  const { data: activeSub } = await adminSupabase
    .from("agent_subscriptions")
    .select("id, expires_at")
    .eq("profile_id", profileId)
    .eq("status", "active")
    .gte("expires_at", new Date().toISOString())
    .order("expires_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (activeSub) {
    // Extender desde la fecha de expiración actual
    const currentExpiry = new Date(activeSub.expires_at);
    const newExpiry = addTime(currentExpiry, amount, unit);

    const { error } = await adminSupabase
      .from("agent_subscriptions")
      .update({ expires_at: newExpiry.toISOString() })
      .eq("id", activeSub.id);

    if (error) return { error: error.message };
  } else {
    // Crear nueva suscripción
    const now = new Date();
    const expiresAt = addTime(now, amount, unit);
    const settings = await getSubscriptionSettings();

    const { error } = await adminSupabase
      .from("agent_subscriptions")
      .insert({
        profile_id: profileId,
        status: "active",
        amount: settings.price,
        currency: settings.currency,
        started_at: now.toISOString(),
        expires_at: expiresAt.toISOString(),
        payment_date: now.toISOString(),
      });

    if (error) return { error: error.message };
  }

  revalidatePath("/admin/usuarios");
  revalidatePath("/admin/finanzas");
  revalidatePath("/dashboard");
  return { success: true };
}

function addTime(
  date: Date,
  amount: number,
  unit: "hours" | "days" | "months" | "years"
): Date {
  const result = new Date(date);
  switch (unit) {
    case "hours":
      result.setHours(result.getHours() + amount);
      break;
    case "days":
      result.setDate(result.getDate() + amount);
      break;
    case "months":
      result.setMonth(result.getMonth() + amount);
      break;
    case "years":
      result.setFullYear(result.getFullYear() + amount);
      break;
  }
  return result;
}

// ─── Admin: Deactivate Subscription ─────────────────────────────────────────

export async function deactivateSubscription(
  profileId: string
): Promise<{ success?: boolean; error?: string }> {
  const caller = await getAuthProfile();
  if (!caller || caller.role !== "admin") {
    return { error: "No autorizado" };
  }

  const adminSupabase = createAdminClient();

  // Marcar suscripción activa como expirada
  const { error } = await adminSupabase
    .from("agent_subscriptions")
    .update({
      status: "expired",
      expires_at: new Date().toISOString(),
    })
    .eq("profile_id", profileId)
    .eq("status", "active");

  if (error) return { error: error.message };

  revalidatePath("/admin/usuarios");
  revalidatePath("/admin/finanzas");
  revalidatePath("/dashboard");
  return { success: true };
}

// ─── Admin: Get All Subscriptions ────────────────────────────────────────────

export async function getAllSubscriptions() {
  const caller = await getAuthProfile();
  if (!caller || caller.role !== "admin") return [];

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("agent_subscriptions")
    .select(
      "id, profile_id, status, amount, currency, started_at, expires_at, payment_date, created_at, agent:profiles!profile_id(full_name, phone)"
    )
    .order("created_at", { ascending: false });

  if (error) return [];

  return (data ?? []).map((row) => {
    const agent = Array.isArray(row.agent) ? row.agent[0] : row.agent;
    return {
      ...row,
      agent_name: agent?.full_name ?? "Sin nombre",
      agent_phone: agent?.phone ?? null,
    };
  });
}
