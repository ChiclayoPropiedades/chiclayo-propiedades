import { AgentRanking } from "../types";

export async function getRankings(): Promise<AgentRanking[]> {
  try {
    // Usar admin client para bypass RLS (visitantes anónimos no pueden leer suscripciones)
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Ejecutar las 3 queries en paralelo
    const [
      { data: rankingData },
      { data: allAgents },
      { data: activeSubs },
    ] = await Promise.all([
      supabase
        .from("agent_rankings")
        .select(
          `id, agent_id, score, properties_count, inquiries_count, sales_count, total_sales_amount, period,
          agent:profiles!agent_id(full_name, avatar_url, phone, role, is_active)`
        )
        .order("score", { ascending: false }),
      supabase
        .from("profiles")
        .select("id, full_name, avatar_url, phone, role, is_active")
        .eq("role", "agent")
        .eq("is_active", true)
        .order("full_name"),
      supabase
        .from("agent_subscriptions")
        .select("profile_id")
        .eq("status", "active")
        .gte("expires_at", new Date().toISOString()),
    ]);

    const activeSubIds = new Set((activeSubs ?? []).map((s) => s.profile_id));

    // Filtrar rankings: solo agentes activos con suscripción vigente
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const validRankings = ((rankingData ?? []) as any[]).filter((r) => {
      const agent = Array.isArray(r.agent) ? r.agent[0] : r.agent;
      return agent?.role === "agent" && agent?.is_active !== false && activeSubIds.has(r.agent_id);
    }) as AgentRanking[];

    const rankedIds = new Set(validRankings.map((r) => r.agent_id));

    // Agentes sin ranking pero con suscripción activa
    const unranked = (allAgents ?? [])
      .filter((a) => !rankedIds.has(a.id) && activeSubIds.has(a.id))
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
