import { createClient } from "@/shared/lib/supabase/server";

export interface DashboardStats {
  propertiesCount: number;
  inquiriesCount: number;
  enrollmentsCount: number;
}

export interface UserProfile {
  id: string;
  full_name: string | null;
  phone: string | null;
  bio: string | null;
  avatar_url: string | null;
  email: string | null;
}

export async function getDashboardStats(userId: string): Promise<DashboardStats> {
  try {
    const supabase = await createClient();

    const [propertiesRes, inquiriesRes, enrollmentsRes] = await Promise.all([
      supabase
        .from("properties")
        .select("id", { count: "exact", head: true })
        .eq("agent_id", userId)
        .eq("is_active", true),
      supabase
        .from("inquiries")
        .select("id", { count: "exact", head: true })
        .eq("agent_id", userId),
      supabase
        .from("training_enrollments")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId),
    ]);

    return {
      propertiesCount: propertiesRes.count ?? 0,
      inquiriesCount: inquiriesRes.count ?? 0,
      enrollmentsCount: enrollmentsRes.count ?? 0,
    };
  } catch {
    return {
      propertiesCount: 0,
      inquiriesCount: 0,
      enrollmentsCount: 0,
    };
  }
}

export async function getProfile(userId: string): Promise<UserProfile | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, phone, bio, avatar_url, email")
      .eq("id", userId)
      .single();

    if (error) return null;
    return data as UserProfile;
  } catch {
    return null;
  }
}
