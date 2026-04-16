import { AgentRanking } from "../types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RankingRow = any;

function getAdminSupabase() {
  // Usar admin client para bypass RLS (visitantes anónimos no pueden leer suscripciones)
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { createClient } = require("@supabase/supabase-js") as typeof import("@supabase/supabase-js");
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

function isValidAgent(r: RankingRow, activeSubIds: Set<string>): boolean {
  const agent = Array.isArray(r.agent) ? r.agent[0] : r.agent;
  return (
    agent?.role === "agent" &&
    agent?.is_active !== false &&
    activeSubIds.has(r.agent_id)
  );
}

/**
 * Devuelve agentes con al menos 1 venta cerrada, ordenados por score DESC.
 * Uso: podio del ranking, sección home.
 */
export async function getRankings(): Promise<AgentRanking[]> {
  try {
    const supabase = getAdminSupabase();

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

    return ((rankingData ?? []) as RankingRow[]).filter(
      (r) => isValidAgent(r, activeSubIds) && r.sales_count > 0
    ) as AgentRanking[];
  } catch {
    return [];
  }
}

/**
 * Devuelve TODOS los agentes activos con suscripción vigente, incluso los que tienen 0 ventas.
 * Ordena por score DESC (los de más ventas primero, los de 0 ventas al final).
 * Uso: tabla del ranking público (con paginación).
 */
export async function getAllAgentsForRanking(): Promise<AgentRanking[]> {
  try {
    const supabase = getAdminSupabase();

    // 1) Subs activas
    const { data: activeSubs } = await supabase
      .from("agent_subscriptions")
      .select("profile_id")
      .eq("status", "active")
      .gte("expires_at", new Date().toISOString());

    const activeSubIds = new Set((activeSubs ?? []).map((s) => s.profile_id));
    if (activeSubIds.size === 0) return [];

    // 2) Profiles de agentes activos con suscripción
    const { data: agents } = await supabase
      .from("profiles")
      .select("id, full_name, avatar_url, phone, role, is_active")
      .eq("role", "agent")
      .neq("is_active", false)
      .in("id", Array.from(activeSubIds));

    if (!agents || agents.length === 0) return [];
    const agentIds = agents.map((a) => a.id);

    // 3) Rankings existentes para esos agentes
    const { data: rankingData } = await supabase
      .from("agent_rankings")
      .select(
        "id, agent_id, score, properties_count, inquiries_count, sales_count, total_sales_amount, period"
      )
      .in("agent_id", agentIds);

    const rankingByAgent = new Map<string, RankingRow>();
    (rankingData ?? []).forEach((r) => rankingByAgent.set(r.agent_id, r));

    // 4) Componer la lista: agentes con ranking y los que aún no tienen
    const merged = agents.map((agent) => {
      const r = rankingByAgent.get(agent.id);
      return {
        id: r?.id ?? `placeholder-${agent.id}`,
        agent_id: agent.id,
        score: r?.score ?? 0,
        properties_count: r?.properties_count ?? 0,
        inquiries_count: r?.inquiries_count ?? 0,
        sales_count: r?.sales_count ?? 0,
        total_sales_amount: r?.total_sales_amount ?? 0,
        period: r?.period ?? "all_time",
        agent: {
          full_name: agent.full_name,
          avatar_url: agent.avatar_url,
          phone: agent.phone,
        },
      };
    }) as AgentRanking[];

    // Orden: score DESC, luego ventas DESC (los sin ventas quedan al final)
    merged.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return b.sales_count - a.sales_count;
    });

    return merged;
  } catch {
    return [];
  }
}
