"use client";

import { useTransition } from "react";
import { Save, Loader2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { toast } from "sonner";

interface SettingsFormProps {
  settings: {
    commission_percentage: string;
    commission_currency: string;
    usd_to_pen_rate: string;
    agent_subscription_price: string;
    agent_subscription_currency: string;
  };
  action: (
    formData: FormData
  ) => Promise<{ success?: boolean; error?: string }>;
}

export function SettingsForm({ settings, action }: SettingsFormProps) {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await action(formData);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Configuración guardada correctamente");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="commission_percentage">Comisión (%)</Label>
          <Input
            id="commission_percentage"
            name="commission_percentage"
            type="number"
            min="0"
            max="100"
            step="0.1"
            defaultValue={settings.commission_percentage}
            disabled={isPending}
            className="border-gray-200"
          />
          <p className="text-xs text-gray-400">
            Porcentaje sobre el precio de venta
          </p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="commission_currency">Moneda de comisión</Label>
          <select
            id="commission_currency"
            name="commission_currency"
            defaultValue={settings.commission_currency}
            disabled={isPending}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-[#2563eb] focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 disabled:opacity-50"
          >
            <option value="PEN">PEN (Soles)</option>
            <option value="USD">USD (Dólares)</option>
          </select>
          <p className="text-xs text-gray-400">
            Moneda en que se calcula la comisión
          </p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="usd_to_pen_rate">Tasa USD → PEN</Label>
          <Input
            id="usd_to_pen_rate"
            name="usd_to_pen_rate"
            type="number"
            min="0"
            step="0.01"
            defaultValue={settings.usd_to_pen_rate}
            disabled={isPending}
            className="border-gray-200"
          />
          <p className="text-xs text-gray-400">
            Para convertir ventas en dólares
          </p>
        </div>
      </div>

      {/* Suscripción de agentes */}
      <div className="border-t border-gray-200 pt-5">
        <h3 className="mb-3 text-sm font-semibold text-[#1f2937]">
          Suscripción anual de agentes
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="agent_subscription_price">Precio anual</Label>
            <Input
              id="agent_subscription_price"
              name="agent_subscription_price"
              type="number"
              min="0"
              step="1"
              defaultValue={settings.agent_subscription_price}
              disabled={isPending}
              className="border-gray-200"
            />
            <p className="text-xs text-gray-400">
              Monto que paga el agente por año
            </p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="agent_subscription_currency">
              Moneda de suscripción
            </Label>
            <select
              id="agent_subscription_currency"
              name="agent_subscription_currency"
              defaultValue={settings.agent_subscription_currency}
              disabled={isPending}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-[#2563eb] focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 disabled:opacity-50"
            >
              <option value="PEN">PEN (Soles)</option>
              <option value="USD">USD (Dólares)</option>
            </select>
            <p className="text-xs text-gray-400">
              Moneda del cobro de suscripción
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-blue-100 bg-blue-50 p-3">
        <p className="text-xs text-blue-700">
          <strong>Ejemplo:</strong> Venta de S/ 300,000 con comisión del{" "}
          {settings.commission_percentage}% = comisión de S/{" "}
          {(300000 * parseFloat(settings.commission_percentage) / 100).toLocaleString("es-PE")}
        </p>
      </div>

      <Button
        type="submit"
        disabled={isPending}
        className="bg-[#2563eb] hover:bg-[#1e40af]"
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            Guardando...
          </>
        ) : (
          <>
            <Save className="mr-2 size-4" />
            Guardar configuración
          </>
        )}
      </Button>
    </form>
  );
}
