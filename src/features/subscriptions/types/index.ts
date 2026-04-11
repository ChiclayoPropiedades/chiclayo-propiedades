export interface AgentSubscription {
  id: string;
  profile_id: string;
  stripe_session_id: string | null;
  status: "pending" | "active" | "expired" | "cancelled";
  amount: number;
  currency: string;
  started_at: string | null;
  expires_at: string | null;
  payment_date: string | null;
  created_at: string;
}

export interface SubscriptionStatus {
  active: boolean;
  expiresAt: string | null;
  subscription: AgentSubscription | null;
}

export interface SubscriptionSettings {
  price: number;
  currency: string;
}
