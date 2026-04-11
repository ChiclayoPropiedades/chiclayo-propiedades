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
  AlertCircle,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { createSubscriptionCheckout } from "@/features/subscriptions/services/subscription-actions";

interface SubscriptionWallProps {
  price: number;
  currency: string;
  isStripeConfigured: boolean;
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
  expiredAt,
}: SubscriptionWallProps) {
  const [isPending, startTransition] = useTransition();

  function handleSubscribe() {
    startTransition(async () => {
      const result = await createSubscriptionCheckout();
      if (result.error) {
        toast.error(result.error);
      } else if (result.url) {
        window.location.href = result.url;
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
              {formatPrice(price, currency)}
            </p>
            <p className="mt-1 text-sm text-white/70">por año</p>
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
          {isStripeConfigured ? (
            <Button
              onClick={handleSubscribe}
              disabled={isPending}
              className="w-full gap-2 bg-[#2563eb] py-6 text-base font-semibold hover:bg-[#1e40af]"
            >
              {isPending ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Procesando...
                </>
              ) : (
                <>
                  <CreditCard className="size-5" />
                  {isExpired ? "Renovar suscripción" : "Suscribirme ahora"}
                </>
              )}
            </Button>
          ) : (
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-center">
              <AlertCircle className="mx-auto mb-2 size-5 text-yellow-600" />
              <p className="text-sm font-medium text-yellow-800">
                Sistema de pagos no disponible
              </p>
              <p className="mt-1 text-xs text-yellow-600">
                Contacta al administrador para activar tu suscripción.
              </p>
            </div>
          )}

          <p className="mt-4 text-center text-xs text-gray-400">
            Pago seguro con Stripe. La suscripción se activa inmediatamente.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
