import { createClient } from "@/shared/lib/supabase/server";
import { Training } from "../types";

export async function getTrainings(): Promise<Training[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("trainings")
      .select("*")
      .eq("is_active", true)
      .order("event_date", { ascending: true });

    if (error) return [];
    return (data ?? []) as Training[];
  } catch {
    return [];
  }
}

export async function getTrainingBySlug(slug: string): Promise<Training | null> {
  try {
    const supabase = await createClient();
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
}
