import { NextResponse } from "next/server";
import { getStripe } from "@/shared/lib/stripe";
import { createClient } from "@supabase/supabase-js";
import type Stripe from "stripe";
import {
  sendEmail,
  emailTrainingConfirmation,
  emailSubscriptionConfirmation,
} from "@/shared/lib/email";

// Usar service role para bypass RLS en webhooks
function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceKey) {
    return createClient(url, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  }

  return createClient(url, serviceKey);
}

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

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    console.warn("Stripe webhook: sin firma o secret no configurado");
    return NextResponse.json({ received: true });
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

    const supabase = getSupabaseAdmin();
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
