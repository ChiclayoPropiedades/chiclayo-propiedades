"use server";

import { createClient } from "@/shared/lib/supabase/server";
import { createAdminClient } from "@/shared/lib/supabase/admin";

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

// ─── Tipos ───────────────────────────────────────────────────────────────────

export interface SaleRecord {
  id: string;
  title: string;
  price: number;
  currency: "PEN" | "USD";
  sale_price: number;
  sale_date: string;
  sale_approved: boolean;
  commission_amount: number | null;
  commission_currency: string | null;
  status: string;
  agent_name: string;
  agent_phone: string | null;
}

export interface EnrollmentRecord {
  id: string;
  training_title: string;
  training_price: number;
  training_currency: string;
  user_name: string;
  payment_status: string;
  enrolled_at: string;
}

export interface FullEnrollmentRecord {
  id: string;
  training_id: string;
  training_title: string;
  training_price: number;
  training_currency: string;
  user_name: string;
  user_phone: string | null;
  payment_status: string;
  enrolled_at: string;
  amount_paid: number | null;
}

export interface FinanceSummary {
  totalSales: number;
  approvedSales: number;
  pendingSales: number;
  totalSalesAmount: number;
  totalCommissions: number;
  totalTrainingRevenue: number;
  totalRevenue: number;
}

// ─── Queries ─────────────────────────────────────────────────────────────────

export async function getFinanceSummary(): Promise<FinanceSummary> {
  const { supabase } = await verifyAdmin();

  const [
    { data: allSales },
    { data: commissions },
    { data: enrollments },
  ] = await Promise.all([
    supabase
      .from("properties")
      .select("sale_price, currency, sale_approved, status")
      .eq("status", "sold"),
    supabase
      .from("properties")
      .select("commission_amount")
      .eq("status", "sold")
      .eq("sale_approved", true)
      .not("commission_amount", "is", null),
    supabase
      .from("training_enrollments")
      .select("training_id, trainings(price)")
      .eq("payment_status", "paid"),
  ]);

  const USD_TO_PEN = 3.7;

  const totalSales = allSales?.length ?? 0;
  const approvedSales = allSales?.filter((s) => s.sale_approved).length ?? 0;
  const pendingSales = totalSales - approvedSales;

  const totalSalesAmount = (allSales ?? [])
    .filter((s) => s.sale_approved)
    .reduce((sum, s) => {
      const amount = s.currency === "USD"
        ? (s.sale_price ?? 0) * USD_TO_PEN
        : (s.sale_price ?? 0);
      return sum + amount;
    }, 0);

  const totalCommissions = (commissions ?? []).reduce(
    (sum, r) => sum + (r.commission_amount ?? 0),
    0
  );

  const totalTrainingRevenue = (enrollments ?? []).reduce((sum, r) => {
    const training = Array.isArray(r.trainings) ? r.trainings[0] : r.trainings;
    return sum + ((training as { price: number } | null)?.price ?? 0);
  }, 0);

  return {
    totalSales,
    approvedSales,
    pendingSales,
    totalSalesAmount: Math.round(totalSalesAmount),
    totalCommissions: Math.round(totalCommissions * 100) / 100,
    totalTrainingRevenue: Math.round(totalTrainingRevenue * 100) / 100,
    totalRevenue:
      Math.round((totalCommissions + totalTrainingRevenue) * 100) / 100,
  };
}

export async function getSalesRecords(): Promise<SaleRecord[]> {
  const { supabase } = await verifyAdmin();

  const { data, error } = await supabase
    .from("properties")
    .select(
      "id, title, price, currency, sale_price, sale_date, sale_approved, commission_amount, commission_currency, status, agent:profiles!agent_id(full_name, phone)"
    )
    .eq("status", "sold")
    .order("sale_date", { ascending: false });

  if (error) return [];

  return (data ?? []).map((row) => {
    const agent = Array.isArray(row.agent) ? row.agent[0] : row.agent;
    return {
      id: row.id,
      title: row.title,
      price: row.price,
      currency: row.currency,
      sale_price: row.sale_price,
      sale_date: row.sale_date,
      sale_approved: row.sale_approved,
      commission_amount: row.commission_amount,
      commission_currency: row.commission_currency,
      status: row.status,
      agent_name: agent?.full_name ?? "Sin agente",
      agent_phone: agent?.phone ?? null,
    };
  }) as SaleRecord[];
}

export async function getEnrollmentRecords(): Promise<EnrollmentRecord[]> {
  const { supabase } = await verifyAdmin();

  const { data, error } = await supabase
    .from("training_enrollments")
    .select(
      "id, payment_status, enrolled_at, training:trainings(title, price, currency), user:profiles!user_id(full_name)"
    )
    .eq("payment_status", "paid")
    .order("enrolled_at", { ascending: false });

  if (error) return [];

  return (data ?? []).map((row) => {
    const training = Array.isArray(row.training)
      ? row.training[0]
      : row.training;
    const user = Array.isArray(row.user) ? row.user[0] : row.user;
    return {
      id: row.id,
      training_title: training?.title ?? "Sin título",
      training_price: training?.price ?? 0,
      training_currency: training?.currency ?? "PEN",
      user_name: user?.full_name ?? "Sin nombre",
      payment_status: row.payment_status,
      enrolled_at: row.enrolled_at,
    };
  }) as EnrollmentRecord[];
}

// ─── Todos los enrollments (para admin/capacitaciones) ──────────────────────

export async function getAllEnrollments(): Promise<FullEnrollmentRecord[]> {
  const adminSupabase = createAdminClient();

  const { data, error } = await adminSupabase
    .from("training_enrollments")
    .select(
      "id, training_id, payment_status, enrolled_at, amount_paid, training:trainings(title, price, currency), user:profiles!user_id(full_name, phone)"
    )
    .order("enrolled_at", { ascending: false });

  if (error) return [];

  return (data ?? []).map((row) => {
    const training = Array.isArray(row.training)
      ? row.training[0]
      : row.training;
    const user = Array.isArray(row.user) ? row.user[0] : row.user;
    return {
      id: row.id,
      training_id: row.training_id,
      training_title: training?.title ?? "Sin titulo",
      training_price: training?.price ?? 0,
      training_currency: training?.currency ?? "PEN",
      user_name: user?.full_name ?? "Sin nombre",
      user_phone: user?.phone ?? null,
      payment_status: row.payment_status,
      enrolled_at: row.enrolled_at,
      amount_paid: row.amount_paid ?? null,
    };
  }) as FullEnrollmentRecord[];
}
