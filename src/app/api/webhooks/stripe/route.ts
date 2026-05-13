import { NextResponse } from "next/server";
import { getStripe } from "@/shared/lib/stripe";
import { createAdminClient } from "@/shared/lib/supabase/admin";
import type Stripe from "stripe";
import {
  sendEmail,
  emailTrainingConfirmation,
  emailSubscriptionConfirmation,
} from "@/shared/lib/email";

export async function POST(request: Request) {
  const stripe = getStripe();

  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe no configurado" },
      { status: 500 }
    );
  }

  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  // Fail-closed (H-1.5): sin firma -> 401, sin secret -> 500.
  // El comportamiento previo retornaba 200 OK silenciosamente, lo que
  // (a) ocultaba misconfig en prod y (b) confirmaba al atacante que el
  // endpoint existe.
  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 401 });
  }
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error(
      "[Stripe Webhook] STRIPE_WEBHOOK_SECRET no configurado en env. " +
        "Webhook no puede verificar firmas."
    );
    return NextResponse.json({ error: "Webhook misconfigured" }, { status: 500 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Firma inválida";
    console.error("Stripe webhook signature error:", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const trainingId = session.metadata?.training_id;
    const userId = session.metadata?.user_id;

    const supabase = createAdminClient();
    const metadataType = session.metadata?.type;

    // ── Pago de suscripción de agente ──
    if (metadataType === "agent_subscription") {
      const profileId = session.metadata?.profile_id;
      if (profileId) {
        // Idempotencia
        const { data: existingSub } = await supabase
          .from("agent_subscriptions")
          .select("id")
          .eq("stripe_session_id", session.id)
          .maybeSingle();

        if (!existingSub) {
          const now = new Date();
          const expiresAt = new Date(now);
          expiresAt.setFullYear(expiresAt.getFullYear() + 1);
          const amount = (session.amount_total ?? 0) / 100;
          const currency = session.currency?.toUpperCase() ?? "PEN";

          await supabase.from("agent_subscriptions").insert({
            profile_id: profileId,
            stripe_session_id: session.id,
            status: "active",
            amount,
            currency,
            started_at: now.toISOString(),
            expires_at: expiresAt.toISOString(),
            payment_date: now.toISOString(),
          });

          // Email de confirmacion
          try {
            const { data: profile } = await supabase
              .from("profiles")
              .select("full_name")
              .eq("id", profileId)
              .single();

            if (session.customer_email) {
              const tpl = emailSubscriptionConfirmation({
                agentName: profile?.full_name ?? "Agente",
                expiresAt: expiresAt.toISOString(),
                amount,
                currency,
              });
              await sendEmail({ to: session.customer_email, ...tpl });
            }
          } catch {
            console.error("[Stripe Webhook] Error enviando email suscripción");
          }
        }
      }
    }

    // ── Pago de capacitación ──
    if (trainingId && userId) {
      // Idempotencia
      const { data: existing } = await supabase
        .from("training_enrollments")
        .select("id")
        .eq("stripe_session_id", session.id)
        .single();

      if (!existing) {
        const amount = (session.amount_total ?? 0) / 100;
        const currency = session.currency?.toUpperCase() ?? "PEN";

        await supabase.from("training_enrollments").insert({
          user_id: userId,
          training_id: trainingId,
          stripe_session_id: session.id,
          payment_status: "paid",
          amount_paid: amount,
          currency,
          payment_date: new Date().toISOString(),
        });

        // Email de confirmacion
        try {
          const { data: training } = await supabase
            .from("trainings")
            .select("title")
            .eq("id", trainingId)
            .single();

          if (session.customer_email && training) {
            const { data: profile } = await supabase
              .from("profiles")
              .select("full_name")
              .eq("user_id", userId)
              .single();

            const tpl = emailTrainingConfirmation({
              userName: profile?.full_name ?? "Usuario",
              trainingTitle: training.title,
              amount,
              currency,
            });
            await sendEmail({ to: session.customer_email, ...tpl });
          }
        } catch {
          console.error("[Stripe Webhook] Error enviando email capacitación");
        }
      }
    }
  }

  return NextResponse.json({ received: true });
}
