import { type Metadata } from "next";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  getSettings,
  updateSettings,
} from "@/features/admin/services/settings-actions";
import { SettingsForm } from "./settings-form";

export const metadata: Metadata = {
  title: "Configuración | Admin",
};

export default async function ConfiguracionPage() {
  const settings = await getSettings();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#1f2937]">Configuración</h2>
        <p className="mt-1 text-sm text-gray-500">
          Configura las comisiones, moneda y tipo de cambio de la plataforma
        </p>
      </div>

      <Card className="border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-[#1f2937]">
            Comisiones y Moneda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SettingsForm settings={settings} action={updateSettings} />
        </CardContent>
      </Card>

      <Card className="border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-[#1f2937]">
            Stripe (Pasarela de Pagos)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div
                className={`size-2.5 rounded-full ${
                  process.env.STRIPE_SECRET_KEY
                    ? "bg-green-500"
                    : "bg-gray-300"
                }`}
              />
              <span className="text-sm text-gray-700">
                {process.env.STRIPE_SECRET_KEY
                  ? "Stripe conectado"
                  : "Stripe no configurado"}
              </span>
            </div>
            <p className="text-xs text-gray-500">
              Para activar pagos, configura las variables de entorno en Vercel:
            </p>
            <div className="rounded-lg bg-gray-50 p-3">
              <code className="block text-xs text-gray-600">
                STRIPE_SECRET_KEY=sk_live_...
              </code>
              <code className="block text-xs text-gray-600">
                STRIPE_WEBHOOK_SECRET=whsec_...
              </code>
              <code className="block text-xs text-gray-600">
                NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
              </code>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
