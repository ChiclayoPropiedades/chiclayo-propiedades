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

      {/* Brevo */}
      <Card className="border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-[#1f2937]">
            Brevo - Emails Transaccionales (Opción 1)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div
                className={`size-2.5 rounded-full ${
                  process.env.BREVO_API_KEY
                    ? "bg-green-500"
                    : "bg-gray-300"
                }`}
              />
              <span className="text-sm text-gray-700">
                {process.env.BREVO_API_KEY
                  ? "Brevo conectado"
                  : "Brevo no configurado"}
              </span>
            </div>
            <p className="text-xs text-gray-500">
              Brevo envía emails automáticos (leads, bienvenida, pagos).
              Plan gratuito: 300 emails/día.
            </p>
            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-700">
                1. Crear cuenta gratis en{" "}
                <a
                  href="https://www.brevo.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#2563eb] underline"
                >
                  brevo.com
                </a>
              </p>
              <p className="text-xs font-medium text-gray-700">
                2. Ir a SMTP & API &rarr; API Keys &rarr; Generar clave
              </p>
              <p className="text-xs font-medium text-gray-700">
                3. Configurar en Vercel:
              </p>
            </div>
            <div className="rounded-lg bg-gray-50 p-3">
              <code className="block text-xs text-gray-600">
                BREVO_API_KEY=xkeysib-...
              </code>
              <code className="block text-xs text-gray-600">
                BREVO_FROM_EMAIL=info@chiclayopropiedades.com
              </code>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gmail API */}
      <Card className="border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-[#1f2937]">
            Gmail API - Emails Transaccionales (Opción 2)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div
                className={`size-2.5 rounded-full ${
                  process.env.GMAIL_REFRESH_TOKEN
                    ? "bg-green-500"
                    : "bg-gray-300"
                }`}
              />
              <span className="text-sm text-gray-700">
                {process.env.GMAIL_REFRESH_TOKEN
                  ? "Gmail API conectado"
                  : "Gmail API no configurado"}
              </span>
            </div>
            <p className="text-xs text-gray-500">
              Envía emails desde tu cuenta Gmail via OAuth2. 500 emails/día gratis.
            </p>
            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-700">
                1. Ir a{" "}
                <a
                  href="https://console.cloud.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#2563eb] underline"
                >
                  Google Cloud Console
                </a>
                {" "}&rarr; Crear proyecto &rarr; Habilitar Gmail API
              </p>
              <p className="text-xs font-medium text-gray-700">
                2. Credenciales &rarr; OAuth 2.0 &rarr; Web Application
              </p>
              <p className="text-xs font-medium text-gray-700">
                3. Obtener refresh token con OAuth Playground
              </p>
              <p className="text-xs font-medium text-gray-700">
                4. Configurar en Vercel:
              </p>
            </div>
            <div className="rounded-lg bg-gray-50 p-3">
              <code className="block text-xs text-gray-600">
                GMAIL_CLIENT_ID=...apps.googleusercontent.com
              </code>
              <code className="block text-xs text-gray-600">
                GMAIL_CLIENT_SECRET=GOCSPX-...
              </code>
              <code className="block text-xs text-gray-600">
                GMAIL_REFRESH_TOKEN=1//...
              </code>
              <code className="block text-xs text-gray-600">
                GMAIL_FROM_EMAIL=propiedadeschiclayo01@gmail.com
              </code>
            </div>
            <div className="rounded-lg border border-amber-100 bg-amber-50 p-3">
              <p className="text-xs text-amber-700">
                <strong>Nota:</strong> Si configuras Brevo Y Gmail, se usa Brevo
                como proveedor principal.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
