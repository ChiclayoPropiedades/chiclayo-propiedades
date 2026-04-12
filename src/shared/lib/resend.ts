// ─── Email Service (Brevo + Gmail API) ──────────────────────────────────────
// Lee credenciales desde platform_settings (DB) con cache en memoria.
// Si ambos proveedores están configurados, usa el seleccionado en email_provider.
// Fallback: Brevo primero, luego Gmail.

import type { EmailSettings } from "@/features/admin/services/settings-actions";

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";
const GMAIL_API_URL = "https://gmail.googleapis.com/gmail/v1/users/me/messages/send";
const RESEND_API_URL = "https://api.resend.com/emails";

// ─── Cache ──────────────────────────────────────────────────────────────────

let cachedSettings: EmailSettings | null = null;
let cacheTime = 0;
const CACHE_TTL = 60_000; // 1 minuto

export function clearEmailCache() {
  cachedSettings = null;
  cacheTime = 0;
}

async function getSettings(): Promise<EmailSettings> {
  const now = Date.now();

  if (cachedSettings && now - cacheTime < CACHE_TTL) {
    return cachedSettings;
  }

  try {
    const { getEmailSettingsForProvider } = await import(
      "@/features/admin/services/settings-actions"
    );
    cachedSettings = await getEmailSettingsForProvider();
    cacheTime = now;
    return cachedSettings;
  } catch {
    console.error("[Email] Error leyendo settings de DB");
    return {
      email_provider: "",
      brevo_api_key: "",
      brevo_from_email: "info@chiclayopropiedades.com",
      gmail_client_id: "",
      gmail_client_secret: "",
      gmail_refresh_token: "",
      gmail_from_email: "propiedadeschiclayo01@gmail.com",
    };
  }
}

// ─── Config Check ───────────────────────────────────────────────────────────

export async function isEmailConfigured(): Promise<boolean> {
  if (process.env.RESEND_API_KEY) return true;
  const s = await getSettings();
  return Boolean(s.brevo_api_key) || Boolean(s.gmail_refresh_token);
}

export async function getEmailProvider(): Promise<"resend" | "brevo" | "gmail" | null> {
  // Resend se detecta por variable de entorno (prioridad maxima)
  if (process.env.RESEND_API_KEY) return "resend";

  const s = await getSettings();

  // Si el admin selecciono un proveedor especifico
  if (s.email_provider === "brevo" && s.brevo_api_key) return "brevo";
  if (s.email_provider === "gmail" && s.gmail_refresh_token) return "gmail";

  // Auto-detect
  if (s.brevo_api_key) return "brevo";
  if (s.gmail_client_id && s.gmail_client_secret && s.gmail_refresh_token)
    return "gmail";

  return null;
}

// ─── Send Email ─────────────────────────────────────────────────────────────

interface SendEmailOptions {
  to: string;
  toName?: string;
  subject: string;
  html: string;
}

export async function sendProviderEmail(
  options: SendEmailOptions
): Promise<{ success: boolean; error?: string }> {
  const provider = await getEmailProvider();

  if (!provider) {
    console.log(
      "[Email] Ningún proveedor configurado, email no enviado:",
      options.subject
    );
    return { success: false, error: "Email no configurado" };
  }

  const s = await getSettings();

  if (provider === "resend") {
    return sendViaResend(options);
  }

  if (provider === "brevo") {
    return sendViaBrevo(s, options);
  }

  return sendViaGmail(s, options);
}

// ─── Resend ─────────────────────────────────────────────────────────────────

async function sendViaResend(
  { to, toName, subject, html }: SendEmailOptions
): Promise<{ success: boolean; error?: string }> {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) return { success: false, error: "RESEND_API_KEY no configurada" };

    const res = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Chiclayo Propiedades <info@chiclayopropiedades.com>",
        to: [to],
        subject,
        html,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error("[Resend] Error:", res.status, err);
      return {
        success: false,
        error: (err as { message?: string }).message ?? `HTTP ${res.status}`,
      };
    }

    return { success: true };
  } catch (err) {
    console.error("[Resend] Error inesperado:", err);
    return { success: false, error: "Error Resend" };
  }
}

// ─── Brevo ──────────────────────────────────────────────────────────────────

async function sendViaBrevo(
  s: EmailSettings,
  { to, toName, subject, html }: SendEmailOptions
): Promise<{ success: boolean; error?: string }> {
  try {
    const sender = {
      email: s.brevo_from_email || "info@chiclayopropiedades.com",
      name: "Chiclayo Propiedades",
    };

    const res = await fetch(BREVO_API_URL, {
      method: "POST",
      headers: {
        "api-key": s.brevo_api_key,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        sender,
        to: [{ email: to, name: toName ?? to }],
        subject,
        htmlContent: html,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error("[Brevo] Error:", res.status, err);
      return {
        success: false,
        error:
          (err as { message?: string }).message ?? `HTTP ${res.status}`,
      };
    }

    return { success: true };
  } catch (err) {
    console.error("[Brevo] Error inesperado:", err);
    return { success: false, error: "Error Brevo" };
  }
}

// ─── Gmail API via OAuth2 ───────────────────────────────────────────────────

async function getGmailAccessToken(s: EmailSettings): Promise<string | null> {
  try {
    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: s.gmail_client_id,
        client_secret: s.gmail_client_secret,
        refresh_token: s.gmail_refresh_token,
        grant_type: "refresh_token",
      }),
    });

    if (!res.ok) {
      console.error("[Gmail] Error obteniendo access token:", res.status);
      return null;
    }

    const data = await res.json();
    return (data as { access_token?: string }).access_token ?? null;
  } catch {
    console.error("[Gmail] Error en OAuth2 token refresh");
    return null;
  }
}

function buildMimeMessage(
  fromEmail: string,
  to: string,
  subject: string,
  html: string
): string {
  const from = `Chiclayo Propiedades <${fromEmail}>`;
  const boundary = "boundary_" + Date.now().toString(36);

  const mime = [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: =?UTF-8?B?${Buffer.from(subject).toString("base64")}?=`,
    "MIME-Version: 1.0",
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    "",
    `--${boundary}`,
    "Content-Type: text/html; charset=UTF-8",
    "Content-Transfer-Encoding: base64",
    "",
    Buffer.from(html).toString("base64"),
    `--${boundary}--`,
  ].join("\r\n");

  return mime;
}

async function sendViaGmail(
  s: EmailSettings,
  { to, subject, html }: SendEmailOptions
): Promise<{ success: boolean; error?: string }> {
  try {
    const accessToken = await getGmailAccessToken(s);
    if (!accessToken) {
      return { success: false, error: "No se pudo obtener token Gmail" };
    }

    const fromEmail =
      s.gmail_from_email || "propiedadeschiclayo01@gmail.com";
    const mimeMessage = buildMimeMessage(fromEmail, to, subject, html);
    const encodedMessage = Buffer.from(mimeMessage)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    const res = await fetch(GMAIL_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ raw: encodedMessage }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error("[Gmail] Error:", res.status, err);
      return {
        success: false,
        error:
          (err as { error?: { message?: string } }).error?.message ??
          `HTTP ${res.status}`,
      };
    }

    return { success: true };
  } catch (err) {
    console.error("[Gmail] Error inesperado:", err);
    return { success: false, error: "Error Gmail" };
  }
}
