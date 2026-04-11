"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Camera, Star, MessageCircle, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { toast } from "sonner";
import { createPublicationRequest } from "@/features/subscriptions/services/publication-actions";

interface PlanInfo {
  name: string;
  price: number;
  photos: number;
  extras?: string;
}

interface PublicationPlanWallProps {
  basic: PlanInfo;
  advanced: PlanInfo;
  currency: string;
  whatsappNumber: string;
}

function formatPrice(price: number, currency: string) {
  return currency === "USD"
    ? `$ ${price.toLocaleString("es-PE")}`
    : `S/ ${price.toLocaleString("es-PE")}`;
}

export function PublicationPlanWall({
  basic,
  advanced,
  currency,
  whatsappNumber,
}: PublicationPlanWallProps) {
  const [selectedPlan, setSelectedPlan] = useState<"basic" | "advanced">("basic");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const plans = [
    { key: "basic" as const, ...basic, icon: Camera },
    { key: "advanced" as const, ...advanced, icon: Star },
  ];

  const selected = selectedPlan === "basic" ? basic : advanced;
  const cleanNumber = whatsappNumber.replace(/[\s+\-()]/g, "");
  const waMessage = `Hola, quiero publicar mi propiedad - Plan ${selected.name} ${formatPrice(selected.price, currency)}`;

  function handleWhatsApp() {
    startTransition(async () => {
      // Registrar solicitud en DB
      const result = await createPublicationRequest(
        selectedPlan,
        selected.name,
        selected.price,
        currency
      );

      if (result.error) {
        toast.error(result.error);
        return;
      }

      // Abrir WhatsApp en nueva pestaña
      window.open(
        `https://wa.me/${cleanNumber}?text=${encodeURIComponent(waMessage)}`,
        "_blank"
      );

      toast.success("Solicitud enviada. Coordina el pago por WhatsApp.");

      // Redirigir a Mis Propiedades para ver estado
      router.push("/dashboard/propiedades");
    });
  }

  return (
    <div className="flex flex-col items-center py-6">
      <Card className="w-full max-w-lg border-gray-200">
        <CardContent className="p-6 sm:p-8">
          {/* Header */}
          <div className="mb-6 text-center">
            <h2 className="text-xl font-bold text-[#1f2937]">
              Publicar Nueva Propiedad
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Selecciona el plan que mejor se adapte a tus necesidades.
            </p>
          </div>

          {/* Plan selector */}
          <div className="mb-6 space-y-3">
            <p className="text-sm font-medium text-[#1f2937]">
              Tipo de publicación
            </p>
            {plans.map(({ key, name, price, photos, extras, icon: Icon }) => (
              <label
                key={key}
                className={`flex cursor-pointer items-start gap-3 rounded-xl border-2 p-4 transition-colors ${
                  selectedPlan === key
                    ? "border-[#2563eb] bg-[#eff6ff]"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="plan"
                  value={key}
                  checked={selectedPlan === key}
                  onChange={() => setSelectedPlan(key)}
                  className="mt-1 size-4 accent-[#2563eb]"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-[#1f2937]">
                      {name} – {formatPrice(price, currency)}
                    </span>
                    <Icon
                      className={`size-4 ${
                        selectedPlan === key
                          ? "text-[#2563eb]"
                          : "text-gray-400"
                      }`}
                    />
                  </div>
                  <p className="mt-0.5 text-xs text-gray-500">
                    {photos === 1
                      ? "1 foto + descripción básica."
                      : `Hasta ${photos} fotos + descripción avanzada${extras ? ` + ${extras.toLowerCase()}` : ""}.`}
                  </p>
                </div>
              </label>
            ))}
          </div>

          {/* WhatsApp CTA */}
          <button
            onClick={handleWhatsApp}
            disabled={isPending}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#25d366] px-4 py-4 text-base font-semibold text-white transition-colors hover:bg-[#1ebe57] disabled:opacity-60"
          >
            {isPending ? (
              <>
                <Loader2 className="size-5 animate-spin" />
                Enviando solicitud...
              </>
            ) : (
              <>
                <MessageCircle className="size-5" />
                Pagar por WhatsApp
              </>
            )}
          </button>

          <p className="mt-3 text-center text-xs text-gray-400">
            Tu solicitud quedará registrada. El administrador la aprobará después del pago.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
