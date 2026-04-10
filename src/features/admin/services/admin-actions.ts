"use server";

import { createClient } from "@/shared/lib/supabase/server";
import { revalidatePath } from "next/cache";

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface AdminProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  bio: string | null;
  role: string | null;
  is_active: boolean | null;
}

export interface AdminProperty {
  id: string;
  agent_id: string;
  title: string;
  slug: string;
  price: number;
  currency: "PEN" | "USD";
  operation: string;
  type: string;
  district: string;
  city: string;
  is_active: boolean;
  featured: boolean;
  created_at: string;
}

export interface AdminInquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  property_id: string | null;
  agent_id: string | null;
  status: "new" | "contacted" | "closed";
  created_at: string;
  property?: { title: string; slug: string } | null;
}

export interface AdminPost {
  id: string;
  author_id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  category: string | null;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
}

export interface AdminTraining {
  id: string;
  title: string;
  slug: string;
  price: number;
  currency: "PEN" | "USD";
  modality: "presencial" | "virtual";
  instructor: string | null;
  event_date: string | null;
  is_active: boolean;
  created_at: string;
}

export interface AdminService {
  id: string;
  title: string;
  description: string;
  icon: string | null;
  display_order: number;
  is_active: boolean;
}

export interface AdminStats {
  totalUsers: number;
  activeProperties: number;
  newLeads: number;
  totalPosts: number;
  totalTrainings: number;
  totalEnrollments: number;
}

export interface NewPostData {
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  cover_image: string;
  is_published: boolean;
}

// ─── Helper interno ────────────────────────────────────────────────────────────

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

  return { supabase, user };
}

// ─── Usuarios ─────────────────────────────────────────────────────────────────

export async function getUsers(): Promise<AdminProfile[]> {
  const { supabase } = await verifyAdmin();

  const { data, error } = await supabase
    .from("profiles")
    .select("id, user_id, full_name, phone, avatar_url, bio, role, is_active")
    .order("full_name", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []) as AdminProfile[];
}

export async function updateUserRole(
  profileId: string,
  role: string
): Promise<void> {
  const { supabase } = await verifyAdmin();

  const { error } = await supabase
    .from("profiles")
    .update({ role })
    .eq("id", profileId);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/usuarios");
}

export async function toggleUserActive(
  profileId: string,
  isActive: boolean
): Promise<void> {
  const { supabase } = await verifyAdmin();

  const { error } = await supabase
    .from("profiles")
    .update({ is_active: isActive })
    .eq("id", profileId);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/usuarios");
}

// ─── Propiedades ──────────────────────────────────────────────────────────────

export async function getAdminProperties(): Promise<AdminProperty[]> {
  const { supabase } = await verifyAdmin();

  const { data, error } = await supabase
    .from("properties")
    .select(
      "id, agent_id, title, slug, price, currency, operation, type, district, city, is_active, featured, created_at"
    )
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as AdminProperty[];
}

export async function togglePropertyActive(
  propertyId: string,
  isActive: boolean
): Promise<void> {
  const { supabase } = await verifyAdmin();

  const { error } = await supabase
    .from("properties")
    .update({ is_active: isActive })
    .eq("id", propertyId);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/propiedades");
}

export async function togglePropertyFeatured(
  propertyId: string,
  featured: boolean
): Promise<void> {
  const { supabase } = await verifyAdmin();

  const { error } = await supabase
    .from("properties")
    .update({ featured })
    .eq("id", propertyId);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/propiedades");
}

// ─── Leads ────────────────────────────────────────────────────────────────────

export async function getAdminInquiries(): Promise<AdminInquiry[]> {
  const { supabase } = await verifyAdmin();

  const { data, error } = await supabase
    .from("inquiries")
    .select(
      "id, name, email, phone, message, property_id, agent_id, status, created_at, property:properties(title, slug)"
    )
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (data ?? []).map((item) => ({
    ...item,
    property: Array.isArray(item.property) ? item.property[0] ?? null : item.property,
  })) as AdminInquiry[];
}

export async function updateInquiryStatus(
  inquiryId: string,
  status: string
): Promise<void> {
  const { supabase } = await verifyAdmin();

  const { error } = await supabase
    .from("inquiries")
    .update({ status })
    .eq("id", inquiryId);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/leads");
}

// ─── Blog ─────────────────────────────────────────────────────────────────────

export async function getAdminPosts(): Promise<AdminPost[]> {
  const { supabase } = await verifyAdmin();

  const { data, error } = await supabase
    .from("blog_posts")
    .select(
      "id, author_id, title, slug, excerpt, category, is_published, published_at, created_at"
    )
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as AdminPost[];
}

export async function togglePostPublished(
  postId: string,
  isPublished: boolean
): Promise<void> {
  const { supabase } = await verifyAdmin();

  const { error } = await supabase
    .from("blog_posts")
    .update({
      is_published: isPublished,
      published_at: isPublished ? new Date().toISOString() : null,
    })
    .eq("id", postId);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/blog");
}

export interface UpdatePostData {
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  cover_image: string;
  is_published: boolean;
}

export async function getAdminPostById(
  postId: string
): Promise<(AdminPost & { content: string; cover_image: string | null }) | null> {
  const { supabase } = await verifyAdmin();

  const { data } = await supabase
    .from("blog_posts")
    .select("id, author_id, title, slug, excerpt, category, content, cover_image, is_published, published_at, created_at")
    .eq("id", postId)
    .maybeSingle();

  return data as (AdminPost & { content: string; cover_image: string | null }) | null;
}

export async function updatePost(postId: string, data: UpdatePostData): Promise<void> {
  const { supabase } = await verifyAdmin();

  const { error } = await supabase
    .from("blog_posts")
    .update({
      title: data.title,
      slug: data.slug,
      category: data.category || null,
      excerpt: data.excerpt || null,
      content: data.content,
      cover_image: data.cover_image || null,
      is_published: data.is_published,
      published_at: data.is_published ? new Date().toISOString() : null,
    })
    .eq("id", postId);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/blog");
}

export async function deletePost(postId: string): Promise<void> {
  const { supabase } = await verifyAdmin();

  const { error } = await supabase
    .from("blog_posts")
    .delete()
    .eq("id", postId);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/blog");
}

export async function createPost(data: NewPostData): Promise<void> {
  const { supabase, user } = await verifyAdmin();

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  const { error } = await supabase.from("blog_posts").insert({
    author_id: profile?.id ?? user.id,
    title: data.title,
    slug: data.slug,
    category: data.category || null,
    excerpt: data.excerpt || null,
    content: data.content,
    cover_image: data.cover_image || null,
    is_published: data.is_published,
    published_at: data.is_published ? new Date().toISOString() : null,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/admin/blog");
}

// ─── Capacitaciones ───────────────────────────────────────────────────────────

export async function getAdminTrainings(): Promise<AdminTraining[]> {
  const { supabase } = await verifyAdmin();

  const { data, error } = await supabase
    .from("trainings")
    .select(
      "id, title, slug, price, currency, modality, instructor, event_date, is_active, created_at"
    )
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as AdminTraining[];
}

export async function toggleTrainingActive(
  trainingId: string,
  isActive: boolean
): Promise<void> {
  const { supabase } = await verifyAdmin();

  const { error } = await supabase
    .from("trainings")
    .update({ is_active: isActive })
    .eq("id", trainingId);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/capacitaciones");
}

// ─── Servicios ────────────────────────────────────────────────────────────────

export async function getAdminServices(): Promise<AdminService[]> {
  const { supabase } = await verifyAdmin();

  const { data, error } = await supabase
    .from("services")
    .select("id, title, description, icon, display_order, is_active")
    .order("display_order", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []) as AdminService[];
}

export async function toggleServiceActive(
  serviceId: string,
  isActive: boolean
): Promise<void> {
  const { supabase } = await verifyAdmin();

  const { error } = await supabase
    .from("services")
    .update({ is_active: isActive })
    .eq("id", serviceId);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/servicios");
}

// ─── Stats ────────────────────────────────────────────────────────────────────

export async function getAdminStats(): Promise<AdminStats> {
  const { supabase } = await verifyAdmin();

  const [
    { count: totalUsers },
    { count: activeProperties },
    { count: newLeads },
    { count: totalPosts },
    { count: totalTrainings },
    { count: totalEnrollments },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase
      .from("properties")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true),
    supabase
      .from("inquiries")
      .select("*", { count: "exact", head: true })
      .eq("status", "new"),
    supabase.from("blog_posts").select("*", { count: "exact", head: true }),
    supabase.from("trainings").select("*", { count: "exact", head: true }),
    supabase
      .from("training_enrollments")
      .select("*", { count: "exact", head: true })
      .eq("payment_status", "paid"),
  ]);

  return {
    totalUsers: totalUsers ?? 0,
    activeProperties: activeProperties ?? 0,
    newLeads: newLeads ?? 0,
    totalPosts: totalPosts ?? 0,
    totalTrainings: totalTrainings ?? 0,
    totalEnrollments: totalEnrollments ?? 0,
  };
}

// ─── Servicios CRUD ───────────────────────────────────────────────────────────

export async function createService(formData: FormData) {
  const { supabase } = await verifyAdmin();
  const { error } = await supabase.from("services").insert({
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    icon: (formData.get("icon") as string) || null,
    display_order: parseInt(formData.get("display_order") as string) || 0,
    is_active: true,
  });
  if (error) return { error: error.message };
  revalidatePath("/admin/servicios");
  return { success: true };
}

export async function updateService(id: string, formData: FormData) {
  const { supabase } = await verifyAdmin();
  const { error } = await supabase
    .from("services")
    .update({
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      icon: (formData.get("icon") as string) || null,
      display_order: parseInt(formData.get("display_order") as string) || 0,
    })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/servicios");
  return { success: true };
}

export async function deleteService(id: string) {
  const { supabase } = await verifyAdmin();
  const { error } = await supabase.from("services").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/servicios");
  return { success: true };
}

// ─── Eliminar Propiedades ─────────────────────────────────────────────────────

export async function deleteProperty(id: string) {
  const { supabase } = await verifyAdmin();
  await supabase.from("property_images").delete().eq("property_id", id);
  const { error } = await supabase.from("properties").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/propiedades");
  return { success: true };
}

// ─── Eliminar Usuarios ────────────────────────────────────────────────────────

export async function deleteUser(profileId: string) {
  const { supabase } = await verifyAdmin();
  const { error } = await supabase.from("profiles").delete().eq("id", profileId);
  if (error) return { error: error.message };
  revalidatePath("/admin/usuarios");
  return { success: true };
}

// ─── Eliminar Leads ───────────────────────────────────────────────────────────

export async function deleteInquiry(id: string) {
  const { supabase } = await verifyAdmin();
  const { error } = await supabase.from("inquiries").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/leads");
  return { success: true };
}

// ─── Eliminar Capacitaciones ──────────────────────────────────────────────────

export async function deleteTraining(id: string) {
  const { supabase } = await verifyAdmin();
  const { error } = await supabase.from("trainings").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/capacitaciones");
  return { success: true };
}

// ─── Ranking ──────────────────────────────────────────────────────────────────

export async function recalculateRankings(): Promise<void> {
  const { supabase } = await verifyAdmin();

  // Obtener propiedades activas por agente
  const { data: agentProps, error: propsError } = await supabase
    .from("properties")
    .select("agent_id")
    .eq("is_active", true);

  if (propsError) throw new Error(propsError.message);

  // Obtener ventas aprobadas por agente (con precio y moneda)
  const { data: approvedSales, error: salesError } = await supabase
    .from("properties")
    .select("agent_id, sale_price, currency")
    .eq("status", "sold")
    .eq("sale_approved", true);

  if (salesError) throw new Error(salesError.message);

  // Obtener consultas por agente
  const { data: agentInquiries, error: inqError } = await supabase
    .from("inquiries")
    .select("agent_id")
    .not("agent_id", "is", null);

  if (inqError) throw new Error(inqError.message);

  // Conteos por agente
  const propsByAgent: Record<string, number> = {};
  for (const row of agentProps ?? []) {
    if (row.agent_id) {
      propsByAgent[row.agent_id] = (propsByAgent[row.agent_id] ?? 0) + 1;
    }
  }

  const inqByAgent: Record<string, number> = {};
  for (const row of agentInquiries ?? []) {
    if (row.agent_id) {
      inqByAgent[row.agent_id] = (inqByAgent[row.agent_id] ?? 0) + 1;
    }
  }

  // Ventas aprobadas: contar y sumar montos (convertir USD a PEN con tasa ~3.7)
  const salesCountByAgent: Record<string, number> = {};
  const salesTotalByAgent: Record<string, number> = {};
  const USD_TO_PEN = 3.7;

  for (const sale of approvedSales ?? []) {
    if (sale.agent_id && sale.sale_price) {
      salesCountByAgent[sale.agent_id] =
        (salesCountByAgent[sale.agent_id] ?? 0) + 1;
      const amountInPEN =
        sale.currency === "USD"
          ? sale.sale_price * USD_TO_PEN
          : sale.sale_price;
      salesTotalByAgent[sale.agent_id] =
        (salesTotalByAgent[sale.agent_id] ?? 0) + amountInPEN;
    }
  }

  const allAgentIds = new Set([
    ...Object.keys(propsByAgent),
    ...Object.keys(inqByAgent),
    ...Object.keys(salesCountByAgent),
  ]);

  const period = new Date().toISOString().slice(0, 7); // YYYY-MM

  for (const agentId of allAgentIds) {
    const propsCount = propsByAgent[agentId] ?? 0;
    const inqCount = inqByAgent[agentId] ?? 0;
    const salesCount = salesCountByAgent[agentId] ?? 0;
    const totalSalesAmount = salesTotalByAgent[agentId] ?? 0;

    // Score = monto total vendido (posición por ventas)
    const score = Math.round(totalSalesAmount);

    await supabase.from("agent_rankings").upsert(
      {
        agent_id: agentId,
        score,
        properties_count: propsCount,
        inquiries_count: inqCount,
        sales_count: salesCount,
        total_sales_amount: Math.round(totalSalesAmount),
        period,
      },
      { onConflict: "agent_id,period" }
    );
  }

  revalidatePath("/admin/ranking");
  revalidatePath("/ranking");
  revalidatePath("/");
}

// ─── Aprobación de Ventas ────────────────────────────────────────────────────

export async function approveSale(propertyId: string): Promise<{ success?: boolean; error?: string }> {
  const { supabase } = await verifyAdmin();

  const { error } = await supabase
    .from("properties")
    .update({ sale_approved: true })
    .eq("id", propertyId)
    .eq("status", "sold");

  if (error) return { error: error.message };

  // Recalcular rankings automáticamente
  await recalculateRankings();

  revalidatePath("/admin/ranking");
  revalidatePath("/ranking");
  revalidatePath("/dashboard/propiedades");
  return { success: true };
}

export async function rejectSale(propertyId: string): Promise<{ success?: boolean; error?: string }> {
  const { supabase } = await verifyAdmin();

  const { error } = await supabase
    .from("properties")
    .update({
      status: "active",
      sale_price: null,
      sale_date: null,
      sale_approved: false,
      is_active: true,
    })
    .eq("id", propertyId);

  if (error) return { error: error.message };

  revalidatePath("/admin/ranking");
  revalidatePath("/dashboard/propiedades");
  return { success: true };
}

export async function getPendingSales() {
  const { supabase } = await verifyAdmin();

  const { data, error } = await supabase
    .from("properties")
    .select(
      "id, title, price, currency, sale_price, sale_date, agent:profiles!agent_id(full_name, phone)"
    )
    .eq("status", "sold")
    .eq("sale_approved", false)
    .order("sale_date", { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}
