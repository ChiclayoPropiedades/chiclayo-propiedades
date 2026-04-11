"use server";

import { createClient } from "@/shared/lib/supabase/server";
import { getMercadoPago, isMercadoPagoConfigured } from "@/shared/lib/mercadopago";
import { Preference } from "mercadopago";
import { getSubscriptionSettings, getSubscriptionStatus } from "./subscription-actions";

export async function createMPSubscriptionCheckout(): Promise<{
  url?: string;
  error?: string;
}> {
  if (!isMercadoPagoConfigured()) {
    return { error: "MercadoPago no configurado. Contacta al administrador." };
  }

  const client = getMercadoPago();
  if (!client) return { error: "Error al inicializar MercadoPago" };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Debes iniciar sesión" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, role")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!profile) return { error: "Perfil no encontrado" };
  if (profile.role !== "agent") return { error: "Solo agentes pueden suscribirse" };

  const { active } = await getSubscriptionStatus(profile.id);
  if (active) return { error: "Ya tienes una suscripción activa" };

  const settings = await getSubscriptionSettings();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  try {
    const preference = new Preference(client);

    const response = await preference.create({
      body: {
        items: [
          {
            id: "agent-subscription",
            title: "Suscripción Anual - Agente Inmobiliario",
            description: "Acceso por 1 año para publicar propiedades en Chiclayo Propiedades",
            quantity: 1,
            currency_id: settings.currency === "USD" ? "USD" : "PEN",
            unit_price: settings.price,
          },
        ],
        payer: {
          email: user.email ?? undefined,
        },
        back_urls: {
          success: `${appUrl}/dashboard/propiedades?subscription=success`,
          failure: `${appUrl}/dashboard/propiedades/nueva?subscription=cancelled`,
          pending: `${appUrl}/dashboard/propiedades?subscription=pending`,
        },
        auto_return: "approved",
        external_reference: JSON.stringify({
          type: "agent_subscription",
          profile_id: profile.id,
        }),
        notification_url: `${appUrl}/api/webhooks/mercadopago`,
      },
    });

    return { url: response.init_point ?? undefined };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Error al crear sesión de pago";
    return { error: message };
  }
}
