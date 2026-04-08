"use server";

import { createClient } from "@/shared/lib/supabase/server";

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
  return { success: true };
}
