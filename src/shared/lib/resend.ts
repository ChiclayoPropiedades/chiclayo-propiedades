// ─── Email Service (Brevo + Gmail API) ──────────────────────────────────────
// Soporta 2 proveedores:
// 1. Brevo (Sendinblue) - API REST, 300 emails/día gratis
// 2. Gmail API via OAuth2 - 500 emails/día gratis
// El sistema usa el que esté configurado. Si ambos están, usa Brevo primero.

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";
const GMAIL_API_URL = "https://gmail.googleapis.com/gmail/v1/users/me/messages/send";

// ─── Config Check ───────────────────────────────────────────────────────────

export function isEmailConfigured(): boolean {
  return isBrevoConfigured() || isGmailConfigured();
}

function isBrevoConfigured(): boolean {
  return Boolean(process.env.BREVO_API_KEY);
}

function isGmailConfigured(): boolean {
  return Boolean(
    process.env.GMAIL_CLIENT_ID &&
    process.env.GMAIL_CLIENT_SECRET &&
    process.env.GMAIL_REFRESH_TOKEN
  );
}

export function getEmailProvider(): "brevo" | "gmail" | null {
  if (isBrevoConfigured()) return "brevo";
  if (isGmailConfigured()) return "gmail";
  return null;
}

export const DEFAULT_FROM = {
  email: process.env.BREVO_FROM_EMAIL ?? process.env.GMAIL_FROM_EMAIL ?? "info@chiclayopropiedades.com",
  name: "Chiclayo Propiedades",
};

// ─── Send Email (auto-detect provider) ──────────────────────────────────────

interface SendEmailOptions {
  to: string;
  toName?: string;
  subject: string;
  html: string;
}

export async function sendProviderEmail(
  options: SendEmailOptions
): Promise<{ success: boolean; error?: string }> {
  const provider = getEmailProvider();

  if (!provider) {
    console.log("[Email] Ningún proveedor configurado, email no enviado:", options.subject);
    return { success: false, error: "Email no configurado" };
  }

  if (provider === "brevo") {
    return sendViaBrevo(options);
  }

  return sendViaGmail(options);
}

// ─── Brevo ──────────────────────────────────────────────────────────────────

async function sendViaBrevo({
  to,
  toName,
  subject,
  html,
}: SendEmailOptions): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(BREVO_API_URL, {
      method: "POST",
      headers: {
        "api-key": process.env.BREVO_API_KEY!,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        sender: DEFAULT_FROM,
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
        error: (err as { message?: string }).message ?? `HTTP ${res.status}`,
      };
    }

    return { success: true };
  } catch (err) {
    console.error("[Brevo] Error inesperado:", err);
    return { success: false, error: "Error Brevo" };
  }
}

// ─── Gmail API via OAuth2 ───────────────────────────────────────────────────

async function getGmailAccessToken(): Promise<string | null> {
  try {
    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.GMAIL_CLIENT_ID!,
        client_secret: process.env.GMAIL_CLIENT_SECRET!,
        refresh_token: process.env.GMAIL_REFRESH_TOKEN!,
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

function buildMimeMessage(to: string, subject: string, html: string): string {
  const from = `${DEFAULT_FROM.name} <${DEFAULT_FROM.email}>`;
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

async function sendViaGmail({
  to,
  subject,
  html,
}: SendEmailOptions): Promise<{ success: boolean; error?: string }> {
  try {
    const accessToken = await getGmailAccessToken();
    if (!accessToken) {
      return { success: false, error: "No se pudo obtener token Gmail" };
    }

    const mimeMessage = buildMimeMessage(to, subject, html);
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
        error: (err as { error?: { message?: string } }).error?.message ?? `HTTP ${res.status}`,
      };
    }

    return { success: true };
  } catch (err) {
    console.error("[Gmail] Error inesperado:", err);
    return { success: false, error: "Error Gmail" };
  }
}
