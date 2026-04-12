import { AgentRanking } from "../types";

export async function getRankings(): Promise<AgentRanking[]> {
  try {
    // Usar admin client para bypass RLS (visitantes anónimos no pueden leer suscripciones)
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Ejecutar las 2 queries en paralelo
    const [
      { data: rankingData },
      { data: activeSubs },
    ] = await Promise.all([
      supabase
        .from("agent_rankings")
        .select(
          `id, agent_id, score, properties_count, inquiries_count, sales_count, total_sales_amount, period,
          agent:profiles!agent_id(full_name, avatar_url, phone, role, is_active)`
        )
        .gt("sales_count", 0)
        .order("score", { ascending: false }),
      supabase
        .from("agent_subscriptions")
        .select("profile_id")
        .eq("status", "active")
        .gte("expires_at", new Date().toISOString()),
    ]);

    const activeSubIds = new Set((activeSubs ?? []).map((s) => s.profile_id));

    // Filtrar rankings: solo agentes activos con suscripción vigente y al menos 1 venta
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const validRankings = ((rankingData ?? []) as any[]).filter((r) => {
      const agent = Array.isArray(r.agent) ? r.agent[0] : r.agent;
      return (
        agent?.role === "agent" &&
        agent?.is_active !== false &&
        activeSubIds.has(r.agent_id) &&
        r.sales_count > 0
      );
    }) as AgentRanking[];

    return validRankings;
  } catch {
    return [];
  }
}
