export interface AgentRanking {
  id: string;
  agent_id: string;
  score: number;
  properties_count: number;
  inquiries_count: number;
  period: string;
  agent?: {
    full_name: string;
    avatar_url: string | null;
    phone: string | null;
  } | {
    full_name: string;
    avatar_url: string | null;
    phone: string | null;
  }[];
}
