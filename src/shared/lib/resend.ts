import { Resend } from "resend";

let resendInstance: Resend | null = null;

export function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) {
    return null;
  }

  if (!resendInstance) {
    resendInstance = new Resend(process.env.RESEND_API_KEY);
  }

  return resendInstance;
}

export function isResendConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

export const DEFAULT_FROM =
  process.env.RESEND_FROM_EMAIL ?? "Chiclayo Propiedades <onboarding@resend.dev>";
