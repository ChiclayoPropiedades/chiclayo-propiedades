import { sendProviderEmail } from "./resend";

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  return sendProviderEmail({ to, subject, html });
}

// ─── Templates ──────────────────────────────────────────────────────────────

export function emailLeadNotification(data: {
  agentName: string;
  leadName: string;
  leadEmail: string;
  leadPhone: string | null;
  leadMessage: string;
  propertyTitle: string | null;
}) {
  const propertyLine = data.propertyTitle
    ? `<p style="margin:0 0 8px"><strong>Propiedad:</strong> ${data.propertyTitle}</p>`
    : "";

  return {
    subject: `Nuevo lead: ${data.leadName} te contactó`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px">
        <div style="background:#0a1628;padding:28px 20px;border-radius:8px 8px 0 0;text-align:center">
          <img src="https://chiclayopropiedades.com/images/logo-white.png" alt="Chiclayo Propiedades" width="200" style="display:inline-block;max-width:200px;height:auto" />
          <div style="margin-top:12px;height:2px;background:linear-gradient(to right,transparent,#b8860b,transparent)"></div>
        </div>
        <div style="background:#fff;padding:24px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px">
          <h2 style="color:#1f2937;margin:0 0 16px">Hola ${data.agentName},</h2>
          <p style="color:#374151;margin:0 0 16px">Tienes un nuevo lead interesado:</p>
          <div style="background:#f9fafb;padding:16px;border-radius:8px;margin:0 0 16px">
            <p style="margin:0 0 8px"><strong>Nombre:</strong> ${data.leadName}</p>
            <p style="margin:0 0 8px"><strong>Email:</strong> ${data.leadEmail}</p>
            ${data.leadPhone ? `<p style="margin:0 0 8px"><strong>Teléfono:</strong> ${data.leadPhone}</p>` : ""}
            ${propertyLine}
            <p style="margin:0"><strong>Mensaje:</strong></p>
            <p style="margin:4px 0 0;color:#6b7280">${data.leadMessage}</p>
          </div>
          <p style="color:#6b7280;font-size:13px;margin:0">
            Responde lo antes posible para no perder este lead.
          </p>
        </div>
      </div>
    `,
  };
}

export function emailWelcome(data: { name: string; role: string }) {
  const roleText =
    data.role === "agent"
      ? "Como agente inmobiliario, puedes publicar propiedades, recibir leads y aparecer en el ranking."
      : "Puedes explorar propiedades, contactar asesores e inscribirte en capacitaciones.";

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://chiclayo-propiedades.vercel.app";

  return {
    subject: "Bienvenido a Chiclayo Propiedades",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px">
        <div style="background:#0a1628;padding:28px 20px;border-radius:8px 8px 0 0;text-align:center">
          <img src="https://chiclayopropiedades.com/images/logo-white.png" alt="Chiclayo Propiedades" width="200" style="display:inline-block;max-width:200px;height:auto" />
          <div style="margin-top:12px;height:2px;background:linear-gradient(to right,transparent,#b8860b,transparent)"></div>
        </div>
        <div style="background:#fff;padding:24px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px">
          <h2 style="color:#1f2937;margin:0 0 16px">Bienvenido, ${data.name}!</h2>
          <p style="color:#374151;margin:0 0 16px">Tu cuenta ha sido creada exitosamente.</p>
          <p style="color:#374151;margin:0 0 16px">${roleText}</p>
          <div style="text-align:center;margin:24px 0">
            <a href="${appUrl}/dashboard" style="background:#2563eb;color:#fff;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:600">
              Ir a mi panel
            </a>
          </div>
          <p style="color:#6b7280;font-size:13px;margin:0;text-align:center">
            Si tienes preguntas, escríbenos por WhatsApp: +51 928 216 206
          </p>
        </div>
      </div>
    `,
  };
}

export function emailTrainingConfirmation(data: {
  userName: string;
  trainingTitle: string;
  amount: number;
  currency: string;
}) {
  const price =
    data.currency === "USD"
      ? `$ ${data.amount.toLocaleString("es-PE")}`
      : `S/ ${data.amount.toLocaleString("es-PE")}`;

  return {
    subject: `Inscripción confirmada: ${data.trainingTitle}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px">
        <div style="background:#0a1628;padding:28px 20px;border-radius:8px 8px 0 0;text-align:center">
          <img src="https://chiclayopropiedades.com/images/logo-white.png" alt="Chiclayo Propiedades" width="200" style="display:inline-block;max-width:200px;height:auto" />
          <div style="margin-top:12px;height:2px;background:linear-gradient(to right,transparent,#b8860b,transparent)"></div>
        </div>
        <div style="background:#fff;padding:24px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px">
          <h2 style="color:#1f2937;margin:0 0 16px">Hola ${data.userName},</h2>
          <p style="color:#374151;margin:0 0 16px">Tu inscripción ha sido confirmada:</p>
          <div style="background:#f0fdf4;padding:16px;border-radius:8px;border:1px solid #bbf7d0;margin:0 0 16px">
            <p style="margin:0 0 8px"><strong>Curso:</strong> ${data.trainingTitle}</p>
            <p style="margin:0"><strong>Monto pagado:</strong> ${price}</p>
          </div>
          <p style="color:#6b7280;font-size:13px;margin:0">
            Recibirás más información sobre el curso próximamente.
          </p>
        </div>
      </div>
    `,
  };
}

export function emailSubscriptionConfirmation(data: {
  agentName: string;
  expiresAt: string;
  amount: number;
  currency: string;
}) {
  const price =
    data.currency === "USD"
      ? `$ ${data.amount.toLocaleString("es-PE")}`
      : `S/ ${data.amount.toLocaleString("es-PE")}`;

  const expiryDate = new Date(data.expiresAt).toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return {
    subject: "Suscripción activada - Chiclayo Propiedades",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px">
        <div style="background:#0a1628;padding:28px 20px;border-radius:8px 8px 0 0;text-align:center">
          <img src="https://chiclayopropiedades.com/images/logo-white.png" alt="Chiclayo Propiedades" width="200" style="display:inline-block;max-width:200px;height:auto" />
          <div style="margin-top:12px;height:2px;background:linear-gradient(to right,transparent,#b8860b,transparent)"></div>
        </div>
        <div style="background:#fff;padding:24px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px">
          <h2 style="color:#1f2937;margin:0 0 16px">Hola ${data.agentName},</h2>
          <p style="color:#374151;margin:0 0 16px">Tu suscripción de agente ha sido activada.</p>
          <div style="background:#eff6ff;padding:16px;border-radius:8px;border:1px solid #bfdbfe;margin:0 0 16px">
            <p style="margin:0 0 8px"><strong>Monto:</strong> ${price}</p>
            <p style="margin:0"><strong>Válida hasta:</strong> ${expiryDate}</p>
          </div>
          <p style="color:#374151;margin:0 0 16px">Ya puedes publicar propiedades y recibir leads.</p>
          <p style="color:#6b7280;font-size:13px;margin:0">
            Si tienes preguntas, escríbenos por WhatsApp: +51 928 216 206
          </p>
        </div>
      </div>
    `,
  };
}


export function emailLeadConfirmation(data: {
  leadName: string;
  propertyTitle: string | null;
}) {
  const propertyLine = data.propertyTitle
    ? `<p style="margin:0 0 8px;color:#374151">Propiedad de interés: <strong>${data.propertyTitle}</strong></p>`
    : "";

  return {
    subject: "Hemos recibido tu consulta - Chiclayo Propiedades",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px">
        <div style="background:#0a1628;padding:28px 20px;border-radius:8px 8px 0 0;text-align:center">
          <img src="https://chiclayopropiedades.com/images/logo-white.png" alt="Chiclayo Propiedades" width="200" style="display:inline-block;max-width:200px;height:auto" />
          <div style="margin-top:12px;height:2px;background:linear-gradient(to right,transparent,#b8860b,transparent)"></div>
        </div>
        <div style="background:#fff;padding:24px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px">
          <h2 style="color:#1f2937;margin:0 0 16px">Hola ${data.leadName},</h2>
          <p style="color:#374151;margin:0 0 16px">Hemos recibido tu consulta exitosamente. Un asesor inmobiliario se pondrá en contacto contigo a la brevedad.</p>
          ${propertyLine}
          <div style="background:#f0f9ff;padding:16px;border-radius:8px;margin:16px 0;border-left:4px solid #2563eb">
            <p style="margin:0;color:#1e40af;font-size:14px"><strong>¿Necesitas atención inmediata?</strong></p>
            <p style="margin:8px 0 0;color:#374151;font-size:14px">Escríbenos por WhatsApp: <a href="https://wa.me/51928216206" style="color:#2563eb;text-decoration:none;font-weight:600">+51 928 216 206</a></p>
          </div>
          <p style="color:#6b7280;font-size:13px;margin:16px 0 0">
            Gracias por confiar en Chiclayo Propiedades. Estamos para ayudarte a encontrar el lugar perfecto.
          </p>
        </div>
        <div style="text-align:center;padding:20px 0">
          <div style="margin-bottom:12px">
            <a href="https://www.facebook.com/chiclayopropiedades" style="text-decoration:none;margin:0 6px"><img src="https://cdn-icons-png.flaticon.com/16/733/733547.png" alt="Facebook" width="16" height="16" /></a>
            <a href="https://www.instagram.com/chiclayopropiedades" style="text-decoration:none;margin:0 6px"><img src="https://cdn-icons-png.flaticon.com/16/2111/2111463.png" alt="Instagram" width="16" height="16" /></a>
            <a href="https://www.youtube.com/@CHICLAYOPROPIEDADES" style="text-decoration:none;margin:0 6px"><img src="https://cdn-icons-png.flaticon.com/16/1384/1384060.png" alt="YouTube" width="16" height="16" /></a>
            <a href="https://www.tiktok.com/@chiclayopropiedades" style="text-decoration:none;margin:0 6px"><img src="https://cdn-icons-png.flaticon.com/16/3046/3046121.png" alt="TikTok" width="16" height="16" /></a>
          </div>
          <p style="color:#9ca3af;font-size:11px;margin:0">Chiclayo Propiedades | Av. Francisco Bolognesi 536, Chiclayo</p>
          <p style="color:#9ca3af;font-size:11px;margin:4px 0 0">+51 928 216 206 | info@chiclayopropiedades.com</p>
          <p style="color:#9ca3af;font-size:11px;margin:4px 0 0">Este correo fue enviado porque completaste un formulario en chiclayopropiedades.com</p>
        </div>
      </div>
    `,
  };
}
