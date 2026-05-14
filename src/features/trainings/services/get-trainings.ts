import { cache } from "react";
import { createPublicClient } from "@/shared/lib/supabase/server";
import { Training } from "../types";

export async function getTrainings(): Promise<Training[]> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("trainings")
      .select("id, title, slug, description, price, currency, modality, event_date, location, instructor, cover_image")
      .eq("is_active", true)
      .order("event_date", { ascending: true });

    if (error) return [];
    return (data ?? []) as Training[];
  } catch {
    return [];
  }
}

export const getTrainingBySlug = cache(async (slug: string): Promise<Training | null> => {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("trainings")
      .select("*")
      .eq("slug", slug)
      .eq("is_active", true)
      .single();

    if (error) return null;
    return data as Training;
  } catch {
    return null;
  }
});
