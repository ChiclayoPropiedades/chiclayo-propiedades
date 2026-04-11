"use server";

import { createClient } from "@/shared/lib/supabase/server";
import { getMercadoPago, isMercadoPagoConfigured } from "@/shared/lib/mercadopago";
import { Preference } from "mercadopago";

export async function createMPCheckoutSession(trainingId: string) {
  if (!isMercadoPagoConfigured()) {
    return { error: "MercadoPago no configurado. Contacta al administrador." };
  }

  const client = getMercadoPago();
  if (!client) return { error: "Error al inicializar MercadoPago" };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Debes iniciar sesión para inscribirte" };

  const { data: training } = await supabase
    .from("trainings")
    .select("id, title, price, currency")
    .eq("id", trainingId)
    .eq("is_active", true)
    .single();

  if (!training) return { error: "Capacitación no encontrada" };

  // Verificar si ya está inscrito
  const { data: existing } = await supabase
    .from("training_enrollments")
    .select("id")
    .eq("user_id", user.id)
    .eq("training_id", trainingId)
    .eq("payment_status", "paid")
    .single();

  if (existing) return { error: "Ya estás inscrito en esta capacitación" };

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  try {
    const preference = new Preference(client);

    const response = await preference.create({
      body: {
        items: [
          {
            id: training.id,
            title: training.title,
            description: `Capacitación: ${training.title}`,
            quantity: 1,
            currency_id: training.currency === "USD" ? "USD" : "PEN",
            unit_price: training.price,
          },
        ],
        payer: {
          email: user.email ?? undefined,
        },
        back_urls: {
          success: `${appUrl}/stripe-success?provider=mercadopago`,
          failure: `${appUrl}/stripe-cancel?provider=mercadopago`,
          pending: `${appUrl}/stripe-success?provider=mercadopago&status=pending`,
        },
        auto_return: "approved",
        external_reference: JSON.stringify({
          type: "training",
          training_id: trainingId,
          user_id: user.id,
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
