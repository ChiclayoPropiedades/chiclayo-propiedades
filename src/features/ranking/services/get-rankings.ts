import { createClient } from "@/shared/lib/supabase/server";
import { AgentRanking } from "../types";

export async function getRankings(): Promise<AgentRanking[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("agent_rankings")
      .select(
        `id, agent_id, score, properties_count, inquiries_count, sales_count, total_sales_amount, period,
        agent:profiles!agent_id(full_name, avatar_url, phone, is_active)`
      )
      .order("score", { ascending: false });

    if (error) return [];

    // Solo mostrar agentes activos
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (data ?? []).filter((r: any) => {
      const agent = Array.isArray(r.agent) ? r.agent[0] : r.agent;
      return agent?.is_active !== false;
    }) as AgentRanking[];
  } catch {
    return [];
  }
}
