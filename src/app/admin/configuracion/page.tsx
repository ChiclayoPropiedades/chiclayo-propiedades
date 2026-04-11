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
  getEmailSettings,
  updateEmailSettings,
} from "@/features/admin/services/settings-actions";
import { sendTestEmail } from "@/features/admin/services/email-test-action";
import { SettingsForm } from "./settings-form";
import { EmailSettingsForm } from "./email-settings-form";

export const metadata: Metadata = {
  title: "Configuración | Admin",
};

export default async function ConfiguracionPage() {
  const [settings, emailSettings] = await Promise.all([
    getSettings(),
    getEmailSettings(),
  ]);

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ?? "https://chiclayo-propiedades.vercel.app";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#1f2937]">Configuración</h2>
        <p className="mt-1 text-sm text-gray-500">
          Configura comisiones, pasarelas de pago y emails transaccionales
        </p>
      </div>

      {/* Comisiones */}
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

      {/* Emails */}
      <Card className="border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-[#1f2937]">
            Emails Transaccionales (Brevo / Gmail)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <EmailSettingsForm
            settings={emailSettings}
            action={updateEmailSettings}
            testAction={sendTestEmail}
          />
        </CardContent>
      </Card>

      {/* MercadoPago */}
      <Card className="border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-[#1f2937]">
            MercadoPago (Pasarela de Pagos Principal)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div
                className={`size-2.5 rounded-full ${
                  process.env.MERCADOPAGO_ACCESS_TOKEN
                    ? "bg-green-500"
                    : "bg-gray-300"
                }`}
              />
              <span className="text-sm text-gray-700">
                {process.env.MERCADOPAGO_ACCESS_TOKEN
                  ? "MercadoPago conectado"
                  : "MercadoPago no configurado"}
              </span>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-700">
                1. Crear cuenta en{" "}
                <a
                  href="https://www.mercadopago.com.pe/developers"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#2563eb] underline"
                >
                  mercadopago.com.pe/developers
                </a>
              </p>
              <p className="text-xs font-medium text-gray-700">
                2. Ir a &quot;Tus integraciones&quot; &rarr; Crear aplicación
              </p>
              <p className="text-xs font-medium text-gray-700">
                3. Copiar credenciales de producción y configurar en Vercel
              </p>
            </div>

            <div className="rounded-lg border border-blue-100 bg-blue-50 p-3">
              <p className="text-xs font-medium text-blue-800">
                Webhook URL:
              </p>
              <p className="mt-1 text-xs text-blue-700">
                <code className="rounded bg-blue-100 px-1.5 py-0.5 font-mono text-blue-800">
                  {appUrl}/api/webhooks/mercadopago
                </code>
              </p>
              <p className="mt-1 text-xs text-blue-600">
                Evento: <strong>payment</strong>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stripe */}
      <Card className="border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-[#1f2937]">
            Stripe (Pasarela Alternativa)
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
                  : "Stripe no configurado (opcional)"}
              </span>
            </div>
            <p className="text-xs text-gray-500">
              Configurar en Vercel: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
