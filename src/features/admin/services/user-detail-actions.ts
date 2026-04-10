"use server";

import { createClient } from "@/shared/lib/supabase/server";

async function verifyAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("No autenticado");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();

  if (profile?.role !== "admin") throw new Error("No autorizado");

  return { supabase };
}

export interface UserProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  bio: string | null;
  role: string | null;
  is_active: boolean | null;
}

export interface UserProperty {
  id: string;
  title: string;
  price: number;
  currency: "PEN" | "USD";
  operation: string;
  type: string;
  district: string;
  status: string | null;
  is_active: boolean;
  sale_price: number | null;
  sale_date: string | null;
  sale_approved: boolean | null;
  commission_amount: number | null;
  created_at: string;
}

export interface UserInquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  status: string;
  created_at: string;
  property?: { title: string } | null;
}

export async function getUserProfile(
  profileId: string
): Promise<UserProfile | null> {
  const { supabase } = await verifyAdmin();

  const { data } = await supabase
    .from("profiles")
    .select("id, user_id, full_name, phone, avatar_url, bio, role, is_active")
    .eq("id", profileId)
    .maybeSingle();

  return data as UserProfile | null;
}

export async function getUserProperties(
  profileId: string
): Promise<UserProperty[]> {
  const { supabase } = await verifyAdmin();

  const { data, error } = await supabase
    .from("properties")
    .select(
      "id, title, price, currency, operation, type, district, status, is_active, sale_price, sale_date, sale_approved, commission_amount, created_at"
    )
    .eq("agent_id", profileId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as UserProperty[];
}

export async function getUserInquiries(
  profileId: string
): Promise<UserInquiry[]> {
  const { supabase } = await verifyAdmin();

  const { data, error } = await supabase
    .from("inquiries")
    .select(
      "id, name, email, phone, message, status, created_at, property:properties(title)"
    )
    .eq("agent_id", profileId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (data ?? []).map((item) => ({
    ...item,
    property: Array.isArray(item.property)
      ? item.property[0] ?? null
      : item.property,
  })) as UserInquiry[];
}
