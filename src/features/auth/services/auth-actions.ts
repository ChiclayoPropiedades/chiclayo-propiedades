"use server";

import { sendEmail, emailWelcome } from "@/shared/lib/email";
import { createClient } from "@/shared/lib/supabase/server";

export async function checkPhoneDuplicate(phone: string): Promise<boolean> {
  if (!phone.trim()) return false;
  const supabase = await createClient();
  const normalized = phone.trim().replace(/[\s\-()]/g, "");

  const { data } = await supabase
    .from("profiles")
    .select("id")
    .or(`phone.eq.${normalized},phone.eq.${phone.trim()}`)
    .limit(1);

  return (data ?? []).length > 0;
}

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
