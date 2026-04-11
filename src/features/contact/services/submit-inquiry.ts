"use server";

import { createClient } from "@/shared/lib/supabase/server";
import { sendEmail, emailLeadNotification } from "@/shared/lib/email";

export async function submitInquiry(formData: FormData) {
  const supabase = await createClient();

  const data = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    phone: (formData.get("phone") as string) || null,
    message: formData.get("message") as string,
    property_id: (formData.get("property_id") as string) || null,
  };

  const { error } = await supabase.from("inquiries").insert(data);

  if (error) return { success: false, error: error.message };

  // Enviar email al agente (no bloquea la respuesta al usuario)
  try {
    let agentEmail = "info@chiclayopropiedades.com";
    let agentName = "Equipo";
    let propertyTitle: string | null = null;

    if (data.property_id) {
      const { data: property } = await supabase
        .from("properties")
        .select("title, agent_id")
        .eq("id", data.property_id)
        .single();

      if (property) {
        propertyTitle = property.title;

        if (property.agent_id) {
          const { data: agent } = await supabase
            .from("profiles")
            .select("full_name, user_id")
            .eq("id", property.agent_id)
            .single();

          if (agent) {
            agentName = agent.full_name ?? "Asesor";

            const { data: authUser } = await supabase
              .from("profiles")
              .select("user_id")
              .eq("id", property.agent_id)
              .single();

            if (authUser?.user_id) {
              // Obtener email del auth user via admin query
              // Usar el email del profile si existe, sino fallback
              agentEmail = "info@chiclayopropiedades.com";
            }
          }
        }
      }
    }

    const template = emailLeadNotification({
      agentName,
      leadName: data.name,
      leadEmail: data.email,
      leadPhone: data.phone,
      leadMessage: data.message,
      propertyTitle,
    });

    await sendEmail({
      to: agentEmail,
      subject: template.subject,
      html: template.html,
    });
  } catch {
    // Email failure should not affect the inquiry submission
    console.error("[Lead Email] Error enviando notificacion");
  }

  return { success: true };
}
