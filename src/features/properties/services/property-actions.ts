"use server";

import { createClient } from "@/shared/lib/supabase/server";
import { redirect } from "next/navigation";

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
    .select("id")
    .eq("user_id", user.id)
    .single();
  if (!profile) return { error: "Perfil no encontrado" };

  const title = formData.get("title") as string;
  const { error } = await supabase.from("properties").insert({
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
  });

  if (error) return { error: error.message };
  redirect("/dashboard/propiedades");
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
