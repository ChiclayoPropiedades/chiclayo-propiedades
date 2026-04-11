import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
import {
  sendEmail,
  emailTrainingConfirmation,
  emailSubscriptionConfirmation,
} from "@/shared/lib/email";

// ─── Supabase Admin (bypass RLS) ────────────────────────────────────────────

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceKey) {
    return createClient(url, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  }

  return createClient(url, serviceKey);
}

// ─── Verificar firma x-signature ───��────────────────────────────────────────

function verifySignature(
  xSignature: string | null,
  xRequestId: string | null,
  dataId: string | null
): boolean {
  const webhookSecret = process.env.MERCADOPAGO_WEBHOOK_SECRET;

  // Sin secret configurado, aceptar todas (modo desarrollo)
  if (!webhookSecret) {
    console.warn("[MP Webhook] MERCADOPAGO_WEBHOOK_SECRET no configurado, aceptando sin verificar");
    return true;
  }

  if (!xSignature || !xRequestId || !dataId) {
    return false;
  }

  try {
    const parts = xSignature.split(",");
    let ts = "";
    let v1 = "";

    for (const part of parts) {
      const [key, value] = part.trim().split("=");
      if (key === "ts") ts = value;
      if (key === "v1") v1 = value;
    }

    if (!ts || !v1) return false;

    const template = `id:${dataId};request-id:${xRequestId};ts:${ts};`;

    const computed = crypto
      .createHmac("sha256", webhookSecret)
      .update(template)
      .digest("hex");

    return computed === v1;
  } catch {
    return false;
  }
}

// ─── Webhook Handler ────────────────────────────────────────────────────────

export async function POST(request: Request) {
  const url = new URL(request.url);
  const dataId = url.searchParams.get("data.id") ?? url.searchParams.get("id");
  const topic = url.searchParams.get("topic") ?? url.searchParams.get("type");

  const xSignature = request.headers.get("x-signature");
  const xRequestId = request.headers.get("x-request-id");

  // Verificar firma
  if (!verifySignature(xSignature, xRequestId, dataId)) {
    console.error("[MP Webhook] Firma inválida");
    return NextResponse.json({ error: "Firma inválida" }, { status: 401 });
  }

  // Solo procesar pagos
  if (topic !== "payment" && topic !== "merchant_order") {
    return NextResponse.json({ received: true });
  }

  if (!dataId) {
    return NextResponse.json({ received: true });
  }

  // Obtener datos del pago desde MercadoPago API
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!accessToken) {
    console.error("[MP Webhook] ACCESS_TOKEN no configurado");
    return NextResponse.json({ received: true });
  }

  try {
    const paymentRes = await fetch(
      `https://api.mercadopago.com/v1/payments/${dataId}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (!paymentRes.ok) {
      console.error("[MP Webhook] Error obteniendo pago:", paymentRes.status);
      return NextResponse.json({ received: true });
    }

    const payment = await paymentRes.json();

    // Solo procesar pagos aprobados
    if (payment.status !== "approved") {
      return NextResponse.json({ received: true });
    }

    // Parsear external_reference
    let ref: { type: string; training_id?: string; user_id?: string; profile_id?: string };
    try {
      ref = JSON.parse(payment.external_reference ?? "{}");
    } catch {
      console.error("[MP Webhook] external_reference inválido");
      return NextResponse.json({ received: true });
    }

    const supabase = getSupabaseAdmin();
    const mpPaymentId = String(payment.id);

    // ── Pago de capacitación ──
    if (ref.type === "training" && ref.training_id && ref.user_id) {
      // Idempotencia: verificar por mp_payment_id
      const { data: existing } = await supabase
        .from("training_enrollments")
        .select("id")
        .eq("mp_payment_id", mpPaymentId)
        .maybeSingle();

      if (!existing) {
        await supabase.from("training_enrollments").insert({
          user_id: ref.user_id,
          training_id: ref.training_id,
          mp_payment_id: mpPaymentId,
          payment_status: "paid",
          amount_paid: payment.transaction_amount ?? 0,
          currency: (payment.currency_id ?? "PEN").toUpperCase(),
          payment_date: new Date().toISOString(),
        });

        // Enviar email de confirmacion
        try {
          const { data: training } = await supabase
            .from("trainings")
            .select("title")
            .eq("id", ref.training_id)
            .single();

          const { data: userData } = await supabase
            .from("profiles")
            .select("full_name, user_id")
            .eq("user_id", ref.user_id)
            .single();

          if (training && payment.payer?.email) {
            const template = emailTrainingConfirmation({
              userName: userData?.full_name ?? "Usuario",
              trainingTitle: training.title,
              amount: payment.transaction_amount ?? 0,
              currency: (payment.currency_id ?? "PEN").toUpperCase(),
            });

            await sendEmail({
              to: payment.payer.email,
              subject: template.subject,
              html: template.html,
            });
          }
        } catch {
          console.error("[MP Webhook] Error enviando email de capacitación");
        }
      }
    }

    // ── Pago de suscripción de agente ──
    if (ref.type === "agent_subscription" && ref.profile_id) {
      const { data: existingSub } = await supabase
        .from("agent_subscriptions")
        .select("id")
        .eq("mp_payment_id", mpPaymentId)
        .maybeSingle();

      if (!existingSub) {
        const now = new Date();
        const expiresAt = new Date(now);
        expiresAt.setFullYear(expiresAt.getFullYear() + 1);

        await supabase.from("agent_subscriptions").insert({
          profile_id: ref.profile_id,
          mp_payment_id: mpPaymentId,
          status: "active",
          amount: payment.transaction_amount ?? 0,
          currency: (payment.currency_id ?? "PEN").toUpperCase(),
          started_at: now.toISOString(),
          expires_at: expiresAt.toISOString(),
          payment_date: now.toISOString(),
        });

        // Enviar email de confirmacion
        try {
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name")
            .eq("id", ref.profile_id)
            .single();

          if (payment.payer?.email) {
            const template = emailSubscriptionConfirmation({
              agentName: profile?.full_name ?? "Agente",
              expiresAt: expiresAt.toISOString(),
              amount: payment.transaction_amount ?? 0,
              currency: (payment.currency_id ?? "PEN").toUpperCase(),
            });

            await sendEmail({
              to: payment.payer.email,
              subject: template.subject,
              html: template.html,
            });
          }
        } catch {
          console.error("[MP Webhook] Error enviando email de suscripción");
        }
      }
    }
  } catch (err) {
    console.error("[MP Webhook] Error procesando:", err);
  }

  return NextResponse.json({ received: true });
}
