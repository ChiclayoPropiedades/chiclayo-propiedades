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

export interface MonthlyData {
  month: string;
  count: number;
}

export interface TypeData {
  type: string;
  count: number;
}

export interface SalesData {
  month: string;
  count: number;
  amount: number;
}

const typeLabels: Record<string, string> = {
  casa: "Casa",
  departamento: "Depto",
  terreno: "Terreno",
  oficina: "Oficina",
  local: "Local",
  otro: "Otro",
};

/**
 * Leads grouped by month (last 12 months)
 */
export async function getLeadsByMonth(): Promise<MonthlyData[]> {
  const { supabase } = await verifyAdmin();

  const { data, error } = await supabase
    .from("inquiries")
    .select("created_at")
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);

  // Group by YYYY-MM
  const grouped: Record<string, number> = {};
  for (const row of data ?? []) {
    const month = row.created_at.slice(0, 7); // YYYY-MM
    grouped[month] = (grouped[month] ?? 0) + 1;
  }

  // Generate last 12 months
  const result: MonthlyData[] = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleDateString("es-PE", {
      month: "short",
      year: "2-digit",
    });
    result.push({ month: label, count: grouped[key] ?? 0 });
  }

  return result;
}

/**
 * Properties grouped by type
 */
export async function getPropertiesByType(): Promise<TypeData[]> {
  const { supabase } = await verifyAdmin();

  const { data, error } = await supabase
    .from("properties")
    .select("type")
    .eq("is_active", true);

  if (error) throw new Error(error.message);

  const grouped: Record<string, number> = {};
  for (const row of data ?? []) {
    const type = row.type ?? "otro";
    grouped[type] = (grouped[type] ?? 0) + 1;
  }

  return Object.entries(grouped).map(([type, count]) => ({
    type: typeLabels[type] ?? type,
    count,
  }));
}

/**
 * Approved sales grouped by month
 */
export async function getSalesByPeriod(): Promise<SalesData[]> {
  const { supabase } = await verifyAdmin();

  const { data, error } = await supabase
    .from("properties")
    .select("sale_date, sale_price, currency")
    .eq("status", "sold")
    .eq("sale_approved", true)
    .not("sale_date", "is", null);

  if (error) throw new Error(error.message);

  const USD_TO_PEN = 3.7;
  const grouped: Record<string, { count: number; amount: number }> = {};

  for (const row of data ?? []) {
    const month = (row.sale_date as string).slice(0, 7);
    if (!grouped[month]) grouped[month] = { count: 0, amount: 0 };
    grouped[month].count += 1;

    const amountInPEN =
      row.currency === "USD"
        ? (row.sale_price ?? 0) * USD_TO_PEN
        : (row.sale_price ?? 0);
    grouped[month].amount += amountInPEN;
  }

  // Generate last 12 months
  const result: SalesData[] = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleDateString("es-PE", {
      month: "short",
      year: "2-digit",
    });
    result.push({
      month: label,
      count: grouped[key]?.count ?? 0,
      amount: Math.round(grouped[key]?.amount ?? 0),
    });
  }

  return result;
}
