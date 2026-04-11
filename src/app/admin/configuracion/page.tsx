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

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ?? "https://chiclayo-propiedades.vercel.app";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#1f2937]">Configuración</h2>
        <p className="mt-1 text-sm text-gray-500">
          Configura las comisiones, moneda, pasarelas de pago y emails
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
                3. Copiar las credenciales de producción y pegarlas en Vercel:
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-3">
              <code className="block text-xs text-gray-600">
                MERCADOPAGO_ACCESS_TOKEN=APP_USR-...
              </code>
              <code className="block text-xs text-gray-600">
                MERCADOPAGO_PUBLIC_KEY=APP_USR-...
              </code>
              <code className="block text-xs text-gray-600">
                MERCADOPAGO_WEBHOOK_SECRET=... (se genera al registrar webhook)
              </code>
            </div>

            <div className="rounded-lg border border-blue-100 bg-blue-50 p-3">
              <p className="text-xs font-medium text-blue-800">
                4. Registrar webhook en MercadoPago:
              </p>
              <p className="mt-1 text-xs text-blue-700">
                URL:{" "}
                <code className="rounded bg-blue-100 px-1.5 py-0.5 font-mono text-blue-800">
                  {appUrl}/api/webhooks/mercadopago
                </code>
              </p>
              <p className="mt-1 text-xs text-blue-600">
                Eventos: <strong>payment</strong> (marcar solo este)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stripe */}
      <Card className="border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-[#1f2937]">
            Stripe (Pasarela de Pagos Alternativa)
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
              Configura Stripe como opción secundaria de pago en Vercel:
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

      {/* Resend */}
      <Card className="border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-[#1f2937]">
            Resend (Emails Transaccionales)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div
                className={`size-2.5 rounded-full ${
                  process.env.RESEND_API_KEY
                    ? "bg-green-500"
                    : "bg-gray-300"
                }`}
              />
              <span className="text-sm text-gray-700">
                {process.env.RESEND_API_KEY
                  ? "Resend conectado"
                  : "Resend no configurado"}
              </span>
            </div>
            <p className="text-xs text-gray-500">
              Resend envía emails automáticos cuando llega un lead, se registra
              un usuario, o se confirma un pago. Plan gratuito: 3,000 emails/mes.
            </p>
            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-700">
                1. Crear cuenta gratis en{" "}
                <a
                  href="https://resend.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#2563eb] underline"
                >
                  resend.com
                </a>
              </p>
              <p className="text-xs font-medium text-gray-700">
                2. Copiar el API Key y configurar en Vercel:
              </p>
            </div>
            <div className="rounded-lg bg-gray-50 p-3">
              <code className="block text-xs text-gray-600">
                RESEND_API_KEY=re_...
              </code>
              <code className="block text-xs text-gray-600">
                RESEND_FROM_EMAIL=info@chiclayopropiedades.com
              </code>
            </div>
            <p className="text-xs text-gray-400">
              Sin estas variables, la plataforma funciona normalmente pero no
              envía emails automáticos.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
