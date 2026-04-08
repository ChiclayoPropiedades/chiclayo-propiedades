import { createClient } from "@/shared/lib/supabase/server";
import { Service } from "../types";

export async function getServices(): Promise<Service[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) return [];
    return (data ?? []) as Service[];
  } catch {
    return [];
  }
}
