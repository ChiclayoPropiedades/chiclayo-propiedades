"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import {
  Shield,
  Building2,
  Trophy,
  MessageSquare,
  Loader2,
  CreditCard,
  CheckCircle2,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { createSubscriptionCheckout, activateSubscriptionFree } from "@/features/subscriptions/services/subscription-actions";
import { createMPSubscriptionCheckout } from "@/features/subscriptions/services/mercadopago-subscription";

interface WhatsAppPayment {
  enabled: boolean;
  number: string;
  message: string;
}

interface SubscriptionWallProps {
  price: number;
  currency: string;
  isStripeConfigured: boolean;
  isMercadoPagoConfigured: boolean;
  freeSubscriptionEnabled?: boolean;
  whatsappPayment?: WhatsAppPayment;
  expiredAt?: string | null;
}

const benefits = [
  {
    icon: Building2,
    title: "Publica propiedades",
    description: "Muestra tus inmuebles a miles de compradores",
  },
  {
    icon: Trophy,
    title: "Aparece en el ranking",
    description: "Compite con otros asesores por las mejores posiciones",
  },
  {
    icon: MessageSquare,
    title: "Recibe leads directos",
    description: "Los compradores te contactan a ti directamente",
  },
];

function formatPrice(price: number, currency: string) {
  return currency === "USD"
    ? `$ ${price.toLocaleString("es-PE")}`
    : `S/ ${price.toLocaleString("es-PE")}`;
}

export function SubscriptionWall({
  price,
  currency,
  isStripeConfigured,
  isMercadoPagoConfigured,
  freeSubscriptionEnabled = false,
  whatsappPayment,
  expiredAt,
}: SubscriptionWallProps) {
  const [isPending, startTransition] = useTransition();

  const hasAnyPayment = isStripeConfigured || isMercadoPagoConfigured;
  const showFreeOption = !hasAnyPayment && freeSubscriptionEnabled;
  const showWhatsApp = whatsappPayment?.enabled && whatsappPayment?.number;

  function handleSubscribe(provider: "mercadopago" | "stripe") {
    startTransition(async () => {
      const result =
        provider === "mercadopago"
          ? await createMPSubscriptionCheckout()
          : await createSubscriptionCheckout();

      if (result.error) {
        toast.error(result.error);
      } else if (result.url) {
        window.location.href = result.url;
      }
    });
  }

  function handleFreeActivation() {
    startTransition(async () => {
      const result = await activateSubscriptionFree();
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Suscripción activada. Ya puedes publicar propiedades.");
        window.location.reload();
      }
    });
  }

  const isExpired = Boolean(expiredAt);

  return (
    <div className="flex flex-col items-center py-8">
      <Card className="w-full max-w-lg border-gray-200">
        <CardContent className="p-8">
          {/* Header */}
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-[#eff6ff]">
              <Shield className="size-8 text-[#2563eb]" />
            </div>
            <h2 className="text-2xl font-bold text-[#1f2937]">
              {isExpired
                ? "Tu suscripción ha expirado"
                : "Activa tu suscripción de agente"}
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              {isExpired
                ? `Tu suscripción expiró el ${new Date(expiredAt!).toLocaleDateString("es-PE", { day: "2-digit", month: "long", year: "numeric" })}. Renueva para seguir publicando.`
                : "Para publicar propiedades necesitas una suscripción activa."}
            </p>
          </div>

          {/* Price */}
          <div className="mb-6 rounded-xl bg-gradient-to-r from-[#2563eb] to-[#1e40af] p-6 text-center text-white">
            <p className="text-sm font-medium text-white/80">
              Suscripción anual
            </p>
            <p className="mt-1 text-4xl font-extrabold">
              {showFreeOption ? "Gratis" : formatPrice(price, currency)}
            </p>
            <p className="mt-1 text-sm text-white/70">
              {showFreeOption ? "por tiempo limitado" : "por año"}
            </p>
          </div>

          {/* Benefits */}
          <div className="mb-6 space-y-3">
            {benefits.map(({ icon: Icon, title, description }) => (
              <div key={title} className="flex items-start gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#eff6ff]">
                  <Icon className="size-4 text-[#2563eb]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1f2937]">
                    {title}
                  </p>
                  <p className="text-xs text-gray-500">{description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          {hasAnyPayment ? (
            <div className="space-y-2">
              {isMercadoPagoConfigured && (
                <Button
                  onClick={() => handleSubscribe("mercadopago")}
                  disabled={isPending}
                  className="w-full gap-2 bg-[#009ee3] py-6 text-base font-semibold hover:bg-[#007eb5]"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="size-5 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    <>
                      <CreditCard className="size-5" />
                      {isExpired ? "Renovar con MercadoPago" : "Pagar con MercadoPago"}
                    </>
                  )}
                </Button>
              )}

              {isStripeConfigured && (
                <Button
                  onClick={() => handleSubscribe("stripe")}
                  disabled={isPending}
                  variant={isMercadoPagoConfigured ? "outline" : "default"}
                  className={
                    isMercadoPagoConfigured
                      ? "w-full gap-2 py-6 text-base font-semibold"
                      : "w-full gap-2 bg-[#2563eb] py-6 text-base font-semibold hover:bg-[#1e40af]"
                  }
                >
                  {isPending ? (
                    <>
                      <Loader2 className="size-5 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    <>
                      <CreditCard className="size-5" />
                      {isExpired ? "Renovar con Stripe" : "Pagar con Stripe"}
                    </>
                  )}
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {/* Botón suscripción gratis */}
              {showFreeOption && (
                <Button
                  onClick={handleFreeActivation}
                  disabled={isPending}
                  className="w-full gap-2 bg-[#2563eb] py-6 text-base font-semibold hover:bg-[#1e40af]"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="size-5 animate-spin" />
                      Activando...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="size-5" />
                      Activar suscripción gratis
                    </>
                  )}
                </Button>
              )}

              {/* Botón WhatsApp */}
              {showWhatsApp && (
                <a
                  href={`https://wa.me/${whatsappPayment.number.replace(/[\s+\-()]/g, "")}?text=${encodeURIComponent(whatsappPayment.message)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#25d366] py-4 text-base font-semibold text-white transition-colors hover:bg-[#1ebe57]"
                >
                  <MessageCircle className="size-5" />
                  Pagar por WhatsApp
                </a>
              )}

              {/* Si no hay ninguna opción */}
              {!showFreeOption && !showWhatsApp && (
                <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-center">
                  <p className="text-sm font-medium text-yellow-800">
                    Sistema de pagos no disponible
                  </p>
                  <p className="mt-1 text-xs text-yellow-600">
                    Contacta al administrador para activar tu suscripción.
                  </p>
                </div>
              )}
            </div>
          )}

          <p className="mt-4 text-center text-xs text-gray-400">
            {showFreeOption
              ? "La suscripción se activa por 1 año inmediatamente."
              : showWhatsApp
                ? "Coordina el pago por WhatsApp. El administrador activará tu suscripción."
                : hasAnyPayment
                  ? "Pago seguro. La suscripción se activa inmediatamente."
                  : "Contacta al administrador para más información."}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
