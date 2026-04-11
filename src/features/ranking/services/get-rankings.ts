import { createClient } from "@/shared/lib/supabase/server";
import { AgentRanking } from "../types";

export async function getRankings(): Promise<AgentRanking[]> {
  try {
    const supabase = await createClient();

    // Traer rankings existentes
    const { data: rankingData } = await supabase
      .from("agent_rankings")
      .select(
        `id, agent_id, score, properties_count, inquiries_count, sales_count, total_sales_amount, period,
        agent:profiles!agent_id(full_name, avatar_url, phone, role, is_active)`
      )
      .order("score", { ascending: false });

    // Traer TODOS los agentes activos
    const { data: allAgents } = await supabase
      .from("profiles")
      .select("id, full_name, avatar_url, phone, role, is_active")
      .eq("role", "agent")
      .eq("is_active", true)
      .order("full_name");

    // Filtrar rankings: solo agentes activos con rol agent
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const validRankings = ((rankingData ?? []) as any[]).filter((r) => {
      const agent = Array.isArray(r.agent) ? r.agent[0] : r.agent;
      return agent?.role === "agent" && agent?.is_active !== false;
    }) as AgentRanking[];

    // IDs de agentes que ya tienen ranking
    const rankedIds = new Set(validRankings.map((r) => r.agent_id));

    // Agentes sin ranking → agregarlos al final con score 0
    const unranked = (allAgents ?? [])
      .filter((a) => !rankedIds.has(a.id))
      .map((a) => ({
        id: `unranked-${a.id}`,
        agent_id: a.id,
        score: 0,
        properties_count: 0,
        inquiries_count: 0,
        sales_count: 0,
        total_sales_amount: 0,
        period: new Date().toISOString().slice(0, 7),
        agent: { full_name: a.full_name, avatar_url: a.avatar_url, phone: a.phone },
      })) as AgentRanking[];

    return [...validRankings, ...unranked];
  } catch {
    return [];
  }
}
