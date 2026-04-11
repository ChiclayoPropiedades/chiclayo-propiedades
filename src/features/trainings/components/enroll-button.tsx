"use client";

import { useState, useTransition } from "react";
import { Loader2, CreditCard, AlertCircle, MessageCircle, Clock } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { createCheckoutSession } from "@/features/trainings/services/training-actions";
import { createMPCheckoutSession } from "@/features/trainings/services/mercadopago-actions";
import { createWhatsAppEnrollment } from "@/features/trainings/services/whatsapp-enrollment";
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
  existingEnrollmentStatus?: string | null;
}

export function EnrollButton({
  trainingId,
  trainingTitle,
  isStripeConfigured,
  isMercadoPagoConfigured,
  whatsappPayment,
  existingEnrollmentStatus,
}: EnrollButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [enrollmentStatus, setEnrollmentStatus] = useState<string | null>(
    existingEnrollmentStatus ?? null
  );

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

  const waNumber = whatsappPayment?.number?.replace(/[\s+\-()]/g, "") ?? "";
  const waMessage = trainingTitle
    ? `Hola, quiero inscribirme en la capacitación: ${trainingTitle}`
    : whatsappPayment?.message ?? "Hola, quiero inscribirme en una capacitación";
  const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`;

  function handleWhatsAppEnroll() {
    startTransition(async () => {
      const result = await createWhatsAppEnrollment(trainingId);
      if (result.error) {
        toast.error(result.error);
      } else {
        if (result.alreadyExists) {
          toast.info("Ya tienes una solicitud registrada para esta capacitación.");
        } else {
          toast.success("Solicitud de inscripción registrada.");
        }
        setEnrollmentStatus("pending");
        // Abrir WhatsApp
        window.open(waUrl, "_blank");
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

  // Si ya tiene enrollment completado
  if (enrollmentStatus === "completed") {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-center">
        <p className="text-sm font-semibold text-green-700">Ya estas inscrito en esta capacitación</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Estado de solicitud pendiente */}
      {enrollmentStatus === "pending" && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
          <div className="flex items-center gap-2 text-amber-700">
            <Clock className="size-4 shrink-0" />
            <p className="text-xs font-medium">
              Solicitud registrada — pendiente de confirmación de pago.
            </p>
          </div>
        </div>
      )}

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

      {/* WhatsApp */}
      {!hasAnyPayment && showWhatsApp && (
        <button
          onClick={handleWhatsAppEnroll}
          disabled={isPending}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#25d366] px-4 py-3 text-base font-semibold text-white transition-colors hover:bg-[#1ebe57] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            <MessageCircle className="size-5" />
          )}
          {enrollmentStatus === "pending"
            ? "Contactar por WhatsApp"
            : "Inscribirme por WhatsApp"}
        </button>
      )}
    </div>
  );
}
