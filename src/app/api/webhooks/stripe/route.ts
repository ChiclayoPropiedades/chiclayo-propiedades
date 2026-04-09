import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.text();

  // TODO: Verificar firma de Stripe cuando se configure
  // const sig = request.headers.get("stripe-signature");
  // const event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);

  // Por ahora retornamos OK
  console.log("Stripe webhook received");

  return NextResponse.json({ received: true });
}
