"use client";

import { useTransition } from "react";
import { Loader2, CreditCard, AlertCircle, MessageCircle } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { createCheckoutSession } from "@/features/trainings/services/training-actions";
import { createMPCheckoutSession } from "@/features/trainings/services/mercadopago-actions";
import { toast } from "sonner";

interface WhatsAppPayment {
  enabled: boolean;
  number: string;
  message: string;
}

interface EnrollButtonProps {
  trainingId: string;
  trainingTitle?: string;
  isStripeConfigured: boolean;
  isMercadoPagoConfigured: boolean;
  whatsappPayment?: WhatsAppPayment;
}

export function EnrollButton({
  trainingId,
  trainingTitle,
  isStripeConfigured,
  isMercadoPagoConfigured,
  whatsappPayment,
}: EnrollButtonProps) {
  const [isPending, startTransition] = useTransition();

  const hasAnyPayment = isStripeConfigured || isMercadoPagoConfigured;
  const showWhatsApp = whatsappPayment?.enabled && whatsappPayment?.number;

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

  if (!hasAnyPayment && !showWhatsApp) {
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

  const waMessage = trainingTitle
    ? `Hola, quiero inscribirme en la capacitación: ${trainingTitle}`
    : whatsappPayment?.message ?? "Hola, quiero inscribirme en una capacitación";

  return (
    <div className="space-y-2">
      {/* MercadoPago */}
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

      {/* Stripe */}
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

      {/* WhatsApp cuando no hay pasarela */}
      {!hasAnyPayment && showWhatsApp && (
        <a
          href={`https://wa.me/${whatsappPayment.number.replace(/[\s+\-()]/g, "")}?text=${encodeURIComponent(waMessage)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#25d366] px-4 py-3 text-base font-semibold text-white transition-colors hover:bg-[#1ebe57]"
        >
          <MessageCircle className="size-5" />
          Inscribirme por WhatsApp
        </a>
      )}
    </div>
  );
}
