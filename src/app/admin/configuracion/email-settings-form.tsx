"use client";

import { useState, useTransition } from "react";
import { Save, Loader2, Send, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { toast } from "sonner";
import type { EmailSettings } from "@/features/admin/services/settings-actions";

interface EmailSettingsFormProps {
  settings: EmailSettings;
  action: (formData: FormData) => Promise<{ success?: boolean; error?: string }>;
  testAction: () => Promise<{ success?: boolean; error?: string }>;
}

export function EmailSettingsForm({
  settings,
  action,
  testAction,
}: EmailSettingsFormProps) {
  const [isPending, startTransition] = useTransition();
  const [isTesting, setIsTesting] = useState(false);
  const [provider, setProvider] = useState(settings.email_provider || "");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await action(formData);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Configuración de email guardada");
      }
    });
  }

  async function handleTest() {
    setIsTesting(true);
    try {
      const result = await testAction();
      if (result.success) {
        toast.success("Email de prueba enviado correctamente");
      } else {
        toast.error(result.error ?? "Error al enviar email de prueba");
      }
    } catch {
      toast.error("Error al enviar email de prueba");
    } finally {
      setIsTesting(false);
    }
  }

  const isBrevoConfigured = Boolean(settings.brevo_api_key);
  const isGmailConfigured = Boolean(settings.gmail_refresh_token);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Proveedor */}
      <div className="space-y-1.5">
        <Label htmlFor="email_provider">Proveedor de email</Label>
        <select
          id="email_provider"
          name="email_provider"
          value={provider}
          onChange={(e) => setProvider(e.target.value)}
          disabled={isPending}
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-[#2563eb] focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 disabled:opacity-50"
        >
          <option value="">Desactivado</option>
          <option value="brevo">Brevo (300 emails/día gratis)</option>
          <option value="gmail">Gmail API (500 emails/día gratis)</option>
        </select>
        <p className="text-xs text-gray-400">
          Selecciona el proveedor para enviar emails automáticos (leads,
          bienvenida, confirmación de pago)
        </p>
      </div>

      {/* Estado actual */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          {isBrevoConfigured ? (
            <CheckCircle2 className="size-4 text-green-500" />
          ) : (
            <XCircle className="size-4 text-gray-300" />
          )}
          <span className="text-xs text-gray-600">Brevo</span>
        </div>
        <div className="flex items-center gap-1.5">
          {isGmailConfigured ? (
            <CheckCircle2 className="size-4 text-green-500" />
          ) : (
            <XCircle className="size-4 text-gray-300" />
          )}
          <span className="text-xs text-gray-600">Gmail</span>
        </div>
      </div>

      {/* Brevo */}
      <div
        className={`space-y-3 rounded-lg border p-4 ${
          provider === "brevo"
            ? "border-blue-200 bg-blue-50/30"
            : "border-gray-200"
        }`}
      >
        <h4 className="text-sm font-semibold text-[#1f2937]">
          Brevo (Sendinblue)
        </h4>
        <p className="text-xs text-gray-500">
          Crear cuenta gratis en{" "}
          <a
            href="https://www.brevo.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#2563eb] underline"
          >
            brevo.com
          </a>{" "}
          &rarr; SMTP & API &rarr; API Keys
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="brevo_api_key">API Key</Label>
            <Input
              id="brevo_api_key"
              name="brevo_api_key"
              type="password"
              placeholder="xkeysib-..."
              defaultValue={settings.brevo_api_key}
              disabled={isPending}
              className="border-gray-200 font-mono text-xs"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="brevo_from_email">Email remitente</Label>
            <Input
              id="brevo_from_email"
              name="brevo_from_email"
              type="email"
              placeholder="info@chiclayopropiedades.com"
              defaultValue={settings.brevo_from_email}
              disabled={isPending}
              className="border-gray-200"
            />
          </div>
        </div>
      </div>

      {/* Gmail */}
      <div
        className={`space-y-3 rounded-lg border p-4 ${
          provider === "gmail"
            ? "border-blue-200 bg-blue-50/30"
            : "border-gray-200"
        }`}
      >
        <h4 className="text-sm font-semibold text-[#1f2937]">Gmail API</h4>
        <p className="text-xs text-gray-500">
          Ir a{" "}
          <a
            href="https://console.cloud.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#2563eb] underline"
          >
            Google Cloud Console
          </a>{" "}
          &rarr; Habilitar Gmail API &rarr; Credenciales OAuth 2.0
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="gmail_client_id">Client ID</Label>
            <Input
              id="gmail_client_id"
              name="gmail_client_id"
              type="password"
              placeholder="...apps.googleusercontent.com"
              defaultValue={settings.gmail_client_id}
              disabled={isPending}
              className="border-gray-200 font-mono text-xs"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="gmail_client_secret">Client Secret</Label>
            <Input
              id="gmail_client_secret"
              name="gmail_client_secret"
              type="password"
              placeholder="GOCSPX-..."
              defaultValue={settings.gmail_client_secret}
              disabled={isPending}
              className="border-gray-200 font-mono text-xs"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="gmail_refresh_token">Refresh Token</Label>
            <Input
              id="gmail_refresh_token"
              name="gmail_refresh_token"
              type="password"
              placeholder="1//..."
              defaultValue={settings.gmail_refresh_token}
              disabled={isPending}
              className="border-gray-200 font-mono text-xs"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="gmail_from_email">Email remitente</Label>
            <Input
              id="gmail_from_email"
              name="gmail_from_email"
              type="email"
              placeholder="propiedadeschiclayo01@gmail.com"
              defaultValue={settings.gmail_from_email}
              disabled={isPending}
              className="border-gray-200"
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
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

        <Button
          type="button"
          variant="outline"
          disabled={isTesting || isPending || !provider}
          onClick={handleTest}
        >
          {isTesting ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Send className="mr-2 size-4" />
              Enviar email de prueba
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
