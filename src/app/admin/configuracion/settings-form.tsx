"use client";

import { useState, useTransition } from "react";
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
    free_subscription_enabled: string;
    whatsapp_payment_enabled: string;
    whatsapp_payment_number: string;
    whatsapp_payment_message: string;
    user_pub_enabled: string;
    user_pub_basic_price: string;
    user_pub_basic_name: string;
    user_pub_advanced_price: string;
    user_pub_advanced_name: string;
    user_pub_advanced_extras: string;
    user_pub_currency: string;
    user_pub_duration_days: string;
  };
  action: (
    formData: FormData
  ) => Promise<{ success?: boolean; error?: string }>;
}

export function SettingsForm({ settings, action }: SettingsFormProps) {
  const [isPending, startTransition] = useTransition();
  const [freeEnabled, setFreeEnabled] = useState(settings.free_subscription_enabled === "true");
  const [waEnabled, setWaEnabled] = useState(settings.whatsapp_payment_enabled === "true");
  const [pubEnabled, setPubEnabled] = useState(settings.user_pub_enabled === "true");

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

        {/* Toggle suscripción gratis */}
        <div className="mt-4 flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <input
            type="hidden"
            name="free_subscription_enabled"
            value={freeEnabled ? "true" : "false"}
          />
          <input
            id="free_subscription_toggle"
            type="checkbox"
            checked={freeEnabled}
            onChange={(e) => setFreeEnabled(e.target.checked)}
            disabled={isPending}
            className="mt-0.5 size-4 accent-[#2563eb]"
          />
          <div>
            <label
              htmlFor="free_subscription_toggle"
              className="cursor-pointer text-sm font-medium text-[#1f2937]"
            >
              Permitir suscripción gratis
            </label>
            <p className="mt-0.5 text-xs text-gray-500">
              Los agentes pueden activar su suscripción sin pagar.
              Desactiva esto cuando configures una pasarela de pago.
            </p>
          </div>
        </div>

        {/* WhatsApp como método de pago */}
        <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-3">
          <div className="flex items-start gap-3">
            <input
              type="hidden"
              name="whatsapp_payment_enabled"
              value={waEnabled ? "true" : "false"}
            />
            <input
              id="whatsapp_payment_toggle"
              type="checkbox"
              checked={waEnabled}
              onChange={(e) => setWaEnabled(e.target.checked)}
              disabled={isPending}
              className="mt-0.5 size-4 accent-[#25d366]"
            />
            <div>
              <label
                htmlFor="whatsapp_payment_toggle"
                className="cursor-pointer text-sm font-medium text-[#1f2937]"
              >
                Pago por WhatsApp
              </label>
              <p className="mt-0.5 text-xs text-gray-500">
                Los agentes ven un botón para contactarte por WhatsApp y
                coordinar el pago manualmente. Tú le envías el enlace o QR
                y luego activas la suscripción desde el panel.
              </p>
            </div>
          </div>

          {waEnabled && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 pl-7">
              <div className="space-y-1.5">
                <Label htmlFor="whatsapp_payment_number">
                  Número de WhatsApp
                </Label>
                <Input
                  id="whatsapp_payment_number"
                  name="whatsapp_payment_number"
                  type="text"
                  placeholder="51928216206"
                  defaultValue={settings.whatsapp_payment_number}
                  disabled={isPending}
                  className="border-gray-200"
                />
                <p className="text-xs text-gray-400">
                  Sin +, sin espacios (ej: 51928216206)
                </p>
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="whatsapp_payment_message">
                  Mensaje predeterminado
                </Label>
                <Input
                  id="whatsapp_payment_message"
                  name="whatsapp_payment_message"
                  type="text"
                  defaultValue={settings.whatsapp_payment_message}
                  disabled={isPending}
                  className="border-gray-200"
                />
                <p className="text-xs text-gray-400">
                  Texto que aparece automáticamente al abrir WhatsApp
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Planes de publicación para usuarios */}
      <div className="border-t border-gray-200 pt-5">
        <div className="flex items-start gap-3 mb-4">
          <input
            type="hidden"
            name="user_pub_enabled"
            value={pubEnabled ? "true" : "false"}
          />
          <input
            id="user_pub_toggle"
            type="checkbox"
            checked={pubEnabled}
            onChange={(e) => setPubEnabled(e.target.checked)}
            disabled={isPending}
            className="mt-0.5 size-4 accent-[#2563eb]"
          />
          <div>
            <label htmlFor="user_pub_toggle" className="cursor-pointer text-sm font-semibold text-[#1f2937]">
              Planes de publicación para usuarios
            </label>
            <p className="mt-0.5 text-xs text-gray-500">
              Usuarios (compradores/vendedores) pueden publicar propiedades pagando por publicación individual.
            </p>
          </div>
        </div>

        {pubEnabled && (
          <div className="space-y-4 pl-7">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label htmlFor="user_pub_basic_name">Plan básico - Nombre</Label>
                <Input id="user_pub_basic_name" name="user_pub_basic_name" defaultValue={settings.user_pub_basic_name} disabled={isPending} className="border-gray-200" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="user_pub_basic_price">Precio básico</Label>
                <Input id="user_pub_basic_price" name="user_pub_basic_price" type="number" min="0" defaultValue={settings.user_pub_basic_price} disabled={isPending} className="border-gray-200" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="user_pub_currency">Moneda</Label>
                <select id="user_pub_currency" name="user_pub_currency" defaultValue={settings.user_pub_currency} disabled={isPending} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-[#2563eb] focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 disabled:opacity-50">
                  <option value="PEN">PEN (Soles)</option>
                  <option value="USD">USD (Dólares)</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label htmlFor="user_pub_advanced_name">Plan avanzado - Nombre</Label>
                <Input id="user_pub_advanced_name" name="user_pub_advanced_name" defaultValue={settings.user_pub_advanced_name} disabled={isPending} className="border-gray-200" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="user_pub_advanced_price">Precio avanzado</Label>
                <Input id="user_pub_advanced_price" name="user_pub_advanced_price" type="number" min="0" defaultValue={settings.user_pub_advanced_price} disabled={isPending} className="border-gray-200" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="user_pub_advanced_extras">Extras del plan avanzado</Label>
                <Input id="user_pub_advanced_extras" name="user_pub_advanced_extras" defaultValue={settings.user_pub_advanced_extras} disabled={isPending} className="border-gray-200" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="user_pub_duration_days">Duración de publicación (días)</Label>
              <Input id="user_pub_duration_days" name="user_pub_duration_days" type="number" min="1" defaultValue={settings.user_pub_duration_days} disabled={isPending} className="border-gray-200 w-32" />
              <p className="text-xs text-gray-400">
                Días que la propiedad se mantiene visible después de ser aprobada.
              </p>
            </div>
            <p className="text-xs text-gray-400">
              Plan básico: 1 foto. Plan avanzado: hasta 10 fotos + extras.
            </p>
          </div>
        )}
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
