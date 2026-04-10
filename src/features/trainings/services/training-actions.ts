"use server";

import { createClient } from "@/shared/lib/supabase/server";
import { getStripe, isStripeConfigured } from "@/shared/lib/stripe";

export async function createCheckoutSession(trainingId: string) {
  if (!isStripeConfigured()) {
    return { error: "Pagos no configurados. Contacta al administrador." };
  }

  const stripe = getStripe();
  if (!stripe) return { error: "Error al inicializar pagos" };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Debes iniciar sesión para inscribirte" };

  // Obtener datos de la capacitación
  const { data: training } = await supabase
    .from("trainings")
    .select("id, title, price, currency, stripe_price_id")
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
    // Si tiene stripe_price_id, usar ese. Si no, crear precio dinámico
    const lineItems = training.stripe_price_id
      ? [{ price: training.stripe_price_id, quantity: 1 }]
      : [
          {
            price_data: {
              currency: training.currency.toLowerCase(),
              product_data: {
                name: training.title,
                description: `Capacitación: ${training.title}`,
              },
              unit_amount: Math.round(training.price * 100), // Stripe usa centavos
            },
            quantity: 1,
          },
        ];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${appUrl}/stripe-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/stripe-cancel`,
      customer_email: user.email ?? undefined,
      metadata: {
        training_id: trainingId,
        user_id: user.id,
      },
    });

    return { url: session.url };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Error al crear sesión de pago";
    return { error: message };
  }
}
