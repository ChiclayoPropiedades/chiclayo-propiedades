"use server";

import { sendEmail, emailWelcome } from "@/shared/lib/email";

export async function sendWelcomeEmail(data: {
  email: string;
  name: string;
  role: string;
}) {
  const template = emailWelcome({
    name: data.name,
    role: data.role,
  });

  await sendEmail({
    to: data.email,
    subject: template.subject,
    html: template.html,
  });
}
