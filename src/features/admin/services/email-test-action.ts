"use server";

import { createClient } from "@/shared/lib/supabase/server";
import { sendEmail } from "@/shared/lib/email";

export async function sendTestEmail(): Promise<{
  success?: boolean;
  error?: string;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "No autenticado" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (profile?.role !== "admin") return { error: "No autorizado" };

  const result = await sendEmail({
    to: user.email ?? "info@chiclayopropiedades.com",
    subject: "Email de prueba - Chiclayo Propiedades",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px">
        <div style="background:#1e3a5f;padding:20px;border-radius:8px 8px 0 0;text-align:center">
          <h1 style="color:#fff;margin:0;font-size:20px">Chiclayo Propiedades</h1>
        </div>
        <div style="background:#fff;padding:24px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px">
          <h2 style="color:#1f2937;margin:0 0 16px">Email de prueba</h2>
          <p style="color:#374151;margin:0 0 16px">
            Este es un email de prueba enviado desde el panel de administración.
            Si puedes leer esto, la configuración de email funciona correctamente.
          </p>
          <div style="background:#f0fdf4;padding:12px;border-radius:8px;border:1px solid #bbf7d0">
            <p style="margin:0;color:#166534;font-weight:600">Conexión exitosa</p>
          </div>
        </div>
      </div>
    `,
  });

  return result;
}
