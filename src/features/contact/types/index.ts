export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  property_id: string | null;
  agent_id: string | null;
  status: "new" | "contacted" | "closed";
  created_at: string;
}
