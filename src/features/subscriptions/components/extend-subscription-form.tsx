"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Clock, Plus, Loader2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  extendSubscription,
  activateSubscriptionManually,
} from "@/features/subscriptions/services/subscription-actions";

interface ExtendSubscriptionFormProps {
  profileId: string;
  hasActiveSubscription: boolean;
  expiresAt: string | null;
}

const unitLabels: Record<string, string> = {
  hours: "Horas",
  days: "Días",
  months: "Meses",
  years: "Años",
};

const presets = [
  { label: "7 días", amount: 7, unit: "days" as const },
  { label: "1 mes", amount: 1, unit: "months" as const },
  { label: "3 meses", amount: 3, unit: "months" as const },
  { label: "6 meses", amount: 6, unit: "months" as const },
  { label: "1 año", amount: 1, unit: "years" as const },
];

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ExtendSubscriptionForm({
  profileId,
  hasActiveSubscription,
  expiresAt,
}: ExtendSubscriptionFormProps) {
  const [isPending, startTransition] = useTransition();
  const [customAmount, setCustomAmount] = useState("1");
  const [customUnit, setCustomUnit] = useState<
    "hours" | "days" | "months" | "years"
  >("months");

  function handlePreset(amount: number, unit: "days" | "months" | "years") {
    startTransition(async () => {
      const result = await extendSubscription(profileId, amount, unit);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(
          hasActiveSubscription
            ? `Suscripción extendida por ${amount} ${unitLabels[unit].toLowerCase()}`
            : `Suscripción activada por ${amount} ${unitLabels[unit].toLowerCase()}`
        );
      }
    });
  }

  function handleCustom() {
    const amount = parseInt(customAmount);
    if (!amount || amount <= 0) {
      toast.error("Ingresa una cantidad válida");
      return;
    }
    startTransition(async () => {
      const result = await extendSubscription(profileId, amount, customUnit);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(
          `Suscripción ${hasActiveSubscription ? "extendida" : "activada"} por ${amount} ${unitLabels[customUnit].toLowerCase()}`
        );
      }
    });
  }

  function handleActivateYear() {
    startTransition(async () => {
      const result = await activateSubscriptionManually(profileId);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Suscripción activada por 1 año");
      }
    });
  }

  return (
    <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex items-center gap-2">
        <Clock className="size-5 text-[#2563eb]" />
        <h3 className="text-sm font-semibold text-[#1f2937]">
          Gestionar Suscripción
        </h3>
      </div>

      {/* Estado actual */}
      <div
        className={`rounded-lg px-4 py-3 text-sm ${
          hasActiveSubscription
            ? "border border-green-200 bg-green-50 text-green-800"
            : "border border-yellow-200 bg-yellow-50 text-yellow-800"
        }`}
      >
        {hasActiveSubscription && expiresAt ? (
          <p>
            <strong>Activa</strong> — expira el {formatDate(expiresAt)}
          </p>
        ) : (
          <p>
            <strong>Sin suscripción activa</strong>
          </p>
        )}
      </div>

      {/* Presets rápidos */}
      <div>
        <p className="mb-2 text-xs font-medium text-gray-500">
          {hasActiveSubscription ? "Extender por:" : "Activar por:"}
        </p>
        <div className="flex flex-wrap gap-2">
          {presets.map((p) => (
            <Button
              key={p.label}
              variant="outline"
              size="sm"
              disabled={isPending}
              onClick={() => handlePreset(p.amount, p.unit)}
              className="text-xs"
            >
              {isPending ? (
                <Loader2 className="size-3 animate-spin" />
              ) : (
                <Plus className="mr-1 size-3" />
              )}
              {p.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Custom */}
      <div>
        <p className="mb-2 text-xs font-medium text-gray-500">
          Personalizado:
        </p>
        <div className="flex items-end gap-2">
          <div className="w-20">
            <Label htmlFor="extend-amount" className="text-xs">
              Cantidad
            </Label>
            <Input
              id="extend-amount"
              type="number"
              min="1"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              disabled={isPending}
              className="h-9 border-gray-200 text-sm"
            />
          </div>
          <div className="w-28">
            <Label htmlFor="extend-unit" className="text-xs">
              Unidad
            </Label>
            <select
              id="extend-unit"
              value={customUnit}
              onChange={(e) =>
                setCustomUnit(
                  e.target.value as "hours" | "days" | "months" | "years"
                )
              }
              disabled={isPending}
              className="flex h-9 w-full rounded-md border border-gray-200 bg-white px-2 text-sm focus:border-[#2563eb] focus:outline-none focus:ring-1 focus:ring-[#2563eb]"
            >
              <option value="hours">Horas</option>
              <option value="days">Días</option>
              <option value="months">Meses</option>
              <option value="years">Años</option>
            </select>
          </div>
          <Button
            onClick={handleCustom}
            disabled={isPending}
            size="sm"
            className="h-9 bg-[#2563eb] text-xs hover:bg-[#1e40af]"
          >
            {isPending ? (
              <Loader2 className="size-3 animate-spin" />
            ) : (
              "Aplicar"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
