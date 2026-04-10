"use client";

import { useTransition } from "react";
import { Loader2, CreditCard, AlertCircle } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { createCheckoutSession } from "@/features/trainings/services/training-actions";
import { toast } from "sonner";

interface EnrollButtonProps {
  trainingId: string;
  isStripeConfigured: boolean;
}

export function EnrollButton({
  trainingId,
  isStripeConfigured,
}: EnrollButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleEnroll = () => {
    startTransition(async () => {
      const result = await createCheckoutSession(trainingId);
      if (result.error) {
        toast.error(result.error);
      } else if (result.url) {
        window.location.href = result.url;
      }
    });
  };

  if (!isStripeConfigured) {
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
    <Button
      onClick={handleEnroll}
      disabled={isPending}
      className="w-full bg-[#2563eb] hover:bg-[#1e40af]"
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
          Inscribirse ahora
        </>
      )}
    </Button>
  );
}
