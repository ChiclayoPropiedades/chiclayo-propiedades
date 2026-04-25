"use server";

import { createClient } from "@/shared/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { hasApprovedPlan, markPlanAsUsed } from "@/features/subscriptions/services/publication-actions";
import { getSubscriptionStatus } from "@/features/subscriptions/services/subscription-actions";
import { recalculateRankings } from "@/features/admin/services/admin-actions";

function generateSlug(title: string): string {
  return (
    title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") +
    "-" +
    Date.now().toString(36)
  );
}

export async function createProperty(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "No autenticado" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, role")
    .eq("user_id", user.id)
    .single();
  if (!profile) return { error: "Perfil no encontrado" };

  // Agentes necesitan suscripción activa para publicar (admins sin restricción)
  if (profile.role === "agent") {
    const { active } = await getSubscriptionStatus(profile.id);
    if (!active) {
      return { error: "Requiere suscripción activa para publicar propiedades" };
    }
  }

  // Usuarios necesitan plan aprobado y no usado
  let userRequestId: string | undefined;
  if (profile.role === "user") {
    const { approved, requestId } = await hasApprovedPlan(profile.id);
    if (!approved) {
      return { error: "Necesitas un plan de publicación aprobado" };
    }
    userRequestId = requestId;
  }

  const title = formData.get("title") as string;
  const { data, error } = await supabase
    .from("properties")
    .insert({
      agent_id: profile.id,
      title,
      slug: generateSlug(title),
      description: (formData.get("description") as string) || null,
      price: parseFloat(formData.get("price") as string),
      currency: formData.get("currency") as string,
      operation: formData.get("operation") as string,
      type: formData.get("type") as string,
      bedrooms: parseInt(formData.get("bedrooms") as string) || null,
      bathrooms: parseInt(formData.get("bathrooms") as string) || null,
      area_m2: parseFloat(formData.get("area_m2") as string) || null,
      address: formData.get("address") as string,
      district: formData.get("district") as string,
      city: (formData.get("city") as string) || "Chiclayo",
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  // Marcar plan como usado (1 pago = 1 publicación)
  if (userRequestId && data.id) {
    await markPlanAsUsed(userRequestId, data.id);
  }

  // Revalidar paginas publicas y dashboard para que aparezca al instante
  revalidatePath("/");
  revalidatePath("/propiedades");
  revalidatePath("/propiedades/[slug]", "page");
  revalidatePath("/dashboard/propiedades");

  return { success: true, propertyId: data.id };
}

export async function updateProperty(id: string, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "No autenticado" };

  const { error } = await supabase
    .from("properties")
    .update({
      title: formData.get("title") as string,
      description: (formData.get("description") as string) || null,
      price: parseFloat(formData.get("price") as string),
      currency: formData.get("currency") as string,
      operation: formData.get("operation") as string,
      type: formData.get("type") as string,
      bedrooms: parseInt(formData.get("bedrooms") as string) || null,
      bathrooms: parseInt(formData.get("bathrooms") as string) || null,
      area_m2: parseFloat(formData.get("area_m2") as string) || null,
      address: formData.get("address") as string,
      district: formData.get("district") as string,
      city: (formData.get("city") as string) || "Chiclayo",
    })
    .eq("id", id);

  if (error) return { error: error.message };

  // Revalidar paginas publicas y dashboard para que aparezca al instante
  revalidatePath("/");
  revalidatePath("/propiedades");
  revalidatePath("/propiedades/[slug]", "page");
  revalidatePath("/dashboard/propiedades");

  redirect("/dashboard/propiedades");
}

export async function getPropertyById(id: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .single();
  return data;
}

export async function deleteOwnProperty(propertyId: string): Promise<{ success?: boolean; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "No autenticado" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, role")
    .eq("user_id", user.id)
    .single();
  if (!profile) return { error: "Perfil no encontrado" };

  // Verificar que la propiedad pertenece al usuario (o es admin) y capturar slug.
  const { data: property } = await supabase
    .from("properties")
    .select("agent_id, slug")
    .eq("id", propertyId)
    .single();

  if (!property) return { error: "Propiedad no encontrada" };
  if (property.agent_id !== profile.id && profile.role !== "admin") {
    return { error: "No tienes permiso para eliminar esta propiedad" };
  }

  // Eliminar imágenes primero
  await supabase.from("property_images").delete().eq("property_id", propertyId);
  // Eliminar propiedad
  const { error } = await supabase.from("properties").delete().eq("id", propertyId);
  if (error) return { error: error.message };

  // Invalidar listados públicos (ISR) y privados.
  revalidatePath("/");
  revalidatePath("/propiedades");
  if (property.slug) revalidatePath(`/propiedades/${property.slug}`);
  revalidatePath("/dashboard/propiedades");
  revalidatePath("/admin/propiedades");
  revalidatePath("/ranking");

  // Borrar afecta properties_count del agente → recalcular ranking.
  try {
    await recalculateRankings();
  } catch {
    // No abortamos el delete si el recálculo falla.
  }

  return { success: true };
}

export async function markPropertyAsSold(propertyId: string, salePrice: number) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "No autenticado" };

  const { error } = await supabase
    .from("properties")
    .update({
      status: "sold",
      sale_price: salePrice,
      sale_date: new Date().toISOString(),
      sale_approved: false,
      is_active: false,
    })
    .eq("id", propertyId);

  if (error) return { error: error.message };

  revalidatePath("/");
  revalidatePath("/propiedades");
  revalidatePath("/propiedades/[slug]", "page");
  revalidatePath("/dashboard/propiedades");
  revalidatePath("/admin/ranking");
  return { success: true };
}

export async function togglePropertyStatus(
  propertyId: string,
  status: "active" | "inactive"
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "No autenticado" };

  const { error } = await supabase
    .from("properties")
    .update({
      status,
      is_active: status === "active",
    })
    .eq("id", propertyId);

  if (error) return { error: error.message };

  revalidatePath("/");
  revalidatePath("/propiedades");
  revalidatePath("/propiedades/[slug]", "page");
  revalidatePath("/dashboard/propiedades");
  return { success: true };
}

// ─── Imágenes ─────────────────────────────────────────────────────────────────

export async function uploadPropertyImage(propertyId: string, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "No autenticado" };

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
  const fileName = `${propertyId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${fileExt}`;

  // Subir a Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from("property-images")
    .upload(fileName, file, { upsert: false });

  if (uploadError) return { error: uploadError.message };

  // Obtener URL pública
  const { data: urlData } = supabase.storage
    .from("property-images")
    .getPublicUrl(fileName);

  const imageUrl = urlData.publicUrl + "?t=" + Date.now();

  // Contar imágenes existentes para display_order
  const { count } = await supabase
    .from("property_images")
    .select("*", { count: "exact", head: true })
    .eq("property_id", propertyId);

  const isFirst = (count ?? 0) === 0;

  // Insertar en DB
  const { data, error: dbError } = await supabase
    .from("property_images")
    .insert({
      property_id: propertyId,
      url: imageUrl,
      display_order: (count ?? 0) + 1,
      is_cover: isFirst,
    })
    .select("id, url, display_order, is_cover")
    .single();

  if (dbError) return { error: dbError.message };

  revalidatePath("/dashboard/propiedades");
  return { success: true, image: data };
}

export async function addPropertyImageUrl(propertyId: string, url: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "No autenticado" };

  if (!url || !url.startsWith("http")) {
    return { error: "URL inválida" };
  }

  // Contar imágenes existentes
  const { count } = await supabase
    .from("property_images")
    .select("*", { count: "exact", head: true })
    .eq("property_id", propertyId);

  const isFirst = (count ?? 0) === 0;

  const { data, error } = await supabase
    .from("property_images")
    .insert({
      property_id: propertyId,
      url,
      display_order: (count ?? 0) + 1,
      is_cover: isFirst,
    })
    .select("id, url, display_order, is_cover")
    .single();

  if (error) return { error: error.message };

  revalidatePath("/dashboard/propiedades");
  return { success: true, image: data };
}

export async function removePropertyImage(imageId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "No autenticado" };

  // Obtener la imagen para ver si está en Storage
  const { data: image } = await supabase
    .from("property_images")
    .select("url, property_id, is_cover")
    .eq("id", imageId)
    .single();

  if (!image) return { error: "Imagen no encontrada" };

  // Si está en Supabase Storage, eliminar archivo
  const storageHost = process.env.NEXT_PUBLIC_SUPABASE_URL + "/storage";
  if (image.url.includes(storageHost)) {
    const path = image.url.split("/property-images/")[1]?.split("?")[0];
    if (path) {
      await supabase.storage.from("property-images").remove([path]);
    }
  }

  // Eliminar de DB
  const { error } = await supabase
    .from("property_images")
    .delete()
    .eq("id", imageId);

  if (error) return { error: error.message };

  // Si era portada, asignar la primera imagen restante como portada
  if (image.is_cover) {
    const { data: remaining } = await supabase
      .from("property_images")
      .select("id")
      .eq("property_id", image.property_id)
      .order("display_order")
      .limit(1);

    if (remaining && remaining.length > 0) {
      await supabase
        .from("property_images")
        .update({ is_cover: true })
        .eq("id", remaining[0].id);
    }
  }

  revalidatePath("/dashboard/propiedades");
  return { success: true };
}

export async function setPropertyCoverImage(imageId: string, propertyId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "No autenticado" };

  // Quitar portada de todas
  await supabase
    .from("property_images")
    .update({ is_cover: false })
    .eq("property_id", propertyId);

  // Asignar nueva portada
  const { error } = await supabase
    .from("property_images")
    .update({ is_cover: true })
    .eq("id", imageId);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/propiedades");
  return { success: true };
}

export async function getPropertyImages(propertyId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("property_images")
    .select("id, url, display_order, is_cover")
    .eq("property_id", propertyId)
    .order("display_order");

  return data ?? [];
}
