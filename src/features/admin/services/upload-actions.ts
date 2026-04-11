"use server";

import { createClient } from "@/shared/lib/supabase/server";

/**
 * Sube una imagen al bucket blog-images de Supabase Storage.
 * Se usa para portadas de blog y capacitaciones.
 */
export async function uploadCoverImage(
  formData: FormData
): Promise<{ url?: string; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "No autenticado" };

  // Verificar que es admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();

  if (profile?.role !== "admin") return { error: "No autorizado" };

  const file = formData.get("file") as File;
  if (!file) return { error: "No se seleccionó archivo" };

  // Validar tipo
  const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
  if (!validTypes.includes(file.type)) {
    return { error: "Solo se permiten imágenes JPG, PNG o WebP" };
  }

  // Validar tamaño (5MB)
  if (file.size > 5 * 1024 * 1024) {
    return { error: "La imagen no debe superar 5MB" };
  }

  // Generar path único
  const fileExt = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const fileName = `covers/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${fileExt}`;

  // Subir a Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from("blog-images")
    .upload(fileName, file, { upsert: false });

  if (uploadError) return { error: uploadError.message };

  // Obtener URL pública
  const { data: urlData } = supabase.storage
    .from("blog-images")
    .getPublicUrl(fileName);

  return { url: urlData.publicUrl };
}
