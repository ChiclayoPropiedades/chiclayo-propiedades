"use server";

import { createClient } from "@/shared/lib/supabase/server";
import { redirect } from "next/navigation";

async function verifyAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado");
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .single();
  if (profile?.role !== "admin") throw new Error("No autorizado");
  return supabase;
}

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

export async function createTraining(formData: FormData) {
  const supabase = await verifyAdmin();
  const title = formData.get("title") as string;
  const { error } = await supabase.from("trainings").insert({
    title,
    slug: generateSlug(title),
    description: formData.get("description") as string,
    content: (formData.get("content") as string) || null,
    price: parseFloat(formData.get("price") as string),
    currency: (formData.get("currency") as string) || "PEN",
    modality: (formData.get("modality") as string) || "presencial",
    location: (formData.get("location") as string) || null,
    instructor: (formData.get("instructor") as string) || null,
    event_date: (formData.get("event_date") as string) || null,
    cover_image: (formData.get("cover_image") as string) || null,
  });
  if (error) return { error: error.message };
  redirect("/admin/capacitaciones");
}

export async function updateTraining(id: string, formData: FormData) {
  const supabase = await verifyAdmin();
  const { error } = await supabase
    .from("trainings")
    .update({
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      content: (formData.get("content") as string) || null,
      price: parseFloat(formData.get("price") as string),
      currency: (formData.get("currency") as string) || "PEN",
      modality: (formData.get("modality") as string) || "presencial",
      location: (formData.get("location") as string) || null,
      instructor: (formData.get("instructor") as string) || null,
      event_date: (formData.get("event_date") as string) || null,
      cover_image: (formData.get("cover_image") as string) || null,
    })
    .eq("id", id);
  if (error) return { error: error.message };
  redirect("/admin/capacitaciones");
}

export async function getTrainingById(id: string) {
  const supabase = await verifyAdmin();
  const { data } = await supabase
    .from("trainings")
    .select("*")
    .eq("id", id)
    .single();
  return data;
}
