"use client";

import { useTransition } from "react";
import { Loader2, CreditCard, AlertCircle } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { createCheckoutSession } from "@/features/trainings/services/training-actions";
import { createMPCheckoutSession } from "@/features/trainings/services/mercadopago-actions";
import { toast } from "sonner";

interface EnrollButtonProps {
  trainingId: string;
  isStripeConfigured: boolean;
  isMercadoPagoConfigured: boolean;
}

export function EnrollButton({
  trainingId,
  isStripeConfigured,
  isMercadoPagoConfigured,
}: EnrollButtonProps) {
  const [isPending, startTransition] = useTransition();

  const hasAnyPayment = isStripeConfigured || isMercadoPagoConfigured;

  function handlePayment(provider: "mercadopago" | "stripe") {
    startTransition(async () => {
      const result =
        provider === "mercadopago"
          ? await createMPCheckoutSession(trainingId)
          : await createCheckoutSession(trainingId);

      if (result.error) {
        toast.error(result.error);
      } else if (result.url) {
        window.location.href = result.url;
      }
    });
  }

  if (!hasAnyPayment) {
    return (
      <div className="space-y-2">
        <Button disabled className="w-full" size="lg">
          <AlertCircle className="mr-2 size-4" />
          Pagos no disponibles
        </Button>
        <p className="text-center text-xs text-gray-500">
          Sistema de pagos en configuración. Contacta al administrador.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* MercadoPago como opción principal */}
      {isMercadoPagoConfigured && (
        <Button
          onClick={() => handlePayment("mercadopago")}
          disabled={isPending}
          className="w-full bg-[#009ee3] hover:bg-[#007eb5]"
          size="lg"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Procesando...
            </>
          ) : (
            <>
              <CreditCard className="mr-2 size-4" />
              Pagar con MercadoPago
            </>
          )}
        </Button>
      )}

      {/* Stripe como opción secundaria */}
      {isStripeConfigured && (
        <Button
          onClick={() => handlePayment("stripe")}
          disabled={isPending}
          variant={isMercadoPagoConfigured ? "outline" : "default"}
          className={
            isMercadoPagoConfigured
              ? "w-full"
              : "w-full bg-[#2563eb] hover:bg-[#1e40af]"
          }
          size="lg"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Procesando...
            </>
          ) : (
            <>
              <CreditCard className="mr-2 size-4" />
              Pagar con Stripe
            </>
          )}
        </Button>
      )}
    </div>
  );
}
