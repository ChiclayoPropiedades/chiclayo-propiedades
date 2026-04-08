"use server";

import { createClient } from "@/shared/lib/supabase/server";
import { revalidatePath } from "next/cache";

interface UpdateProfileInput {
  full_name: string;
  phone: string;
  bio: string;
}

interface UpdateProfileResult {
  success: boolean;
  error?: string;
}

export async function updateProfile(
  input: UpdateProfileInput
): Promise<UpdateProfileResult> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "No autenticado" };
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: input.full_name.trim(),
        phone: input.phone.trim() || null,
        bio: input.bio.trim() || null,
      })
      .eq("id", user.id);

    if (error) {
      return { success: false, error: "Error al actualizar el perfil" };
    }

    revalidatePath("/dashboard/perfil");
    return { success: true };
  } catch {
    return { success: false, error: "Error inesperado. Intenta de nuevo." };
  }
}
