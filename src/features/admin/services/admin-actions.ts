"use server";

import { createClient } from "@/shared/lib/supabase/server";
import { createAdminClient } from "@/shared/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface AdminProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string | null;
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
  agent?: { full_name: string; phone: string | null } | { full_name: string; phone: string | null }[];
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

export interface EnhancedAdminStats extends AdminStats {
  totalAgents: number;
  totalBasicUsers: number;
  soldProperties: number;
  contactedLeads: number;
  closedLeads: number;
  approvedSalesCount: number;
  totalCommissions: number;
  trainingRevenue: number;
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
  await verifyAdmin();
  const adminSupabase = createAdminClient();

  const { data, error } = await adminSupabase
    .from("profiles")
    .select("id, user_id, full_name, phone, avatar_url, bio, role, is_active")
    .order("full_name", { ascending: true });

  if (error) throw new Error(error.message);

  // Obtener emails desde auth.users
  const { data: authUsers } = await adminSupabase.auth.admin.listUsers();

  const emailMap = new Map<string, string>();
  for (const u of authUsers?.users ?? []) {
    emailMap.set(u.id, u.email ?? "");
  }

  return (data ?? []).map((p) => ({
    ...p,
    email: emailMap.get(p.user_id) ?? null,
  })) as AdminProfile[];
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
  await verifyAdmin();
  const adminSupabase = createAdminClient();

  const { error } = await adminSupabase
    .from("profiles")
    .update({ is_active: isActive })
    .eq("id", profileId);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/usuarios");
}

const updateUserProfileSchema = z.object({
  full_name: z.string().trim().min(1, "Nombre requerido").max(100),
  phone: z.string().trim().max(20),
  bio: z.string().trim().max(1000),
  role: z.enum(["user", "agent", "admin"]),
});

export async function updateUserProfile(
  profileId: string,
  data: { full_name: string; phone: string; bio: string; role: string }
): Promise<{ success?: boolean; error?: string }> {
  await verifyAdmin();

  const parsed = updateUserProfileSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }
  const clean = parsed.data;

  const adminSupabase = createAdminClient();

  // Validar teléfono duplicado
  if (clean.phone) {
    const { data: existing } = await adminSupabase
      .from("profiles")
      .select("id")
      .eq("phone", clean.phone)
      .neq("id", profileId)
      .limit(1);

    if ((existing ?? []).length > 0) {
      return { error: "Este número de teléfono ya está registrado por otro usuario." };
    }
  }

  // Normalizar nombre
  const normalizedName = clean.full_name
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());

  const { error } = await adminSupabase
    .from("profiles")
    .update({
      full_name: normalizedName,
      phone: clean.phone || null,
      bio: clean.bio,
      role: clean.role,
    })
    .eq("id", profileId);

  if (error) return { error: error.message };

  revalidatePath("/admin/usuarios");
  revalidatePath(`/admin/usuarios/${profileId}`);
  // El cambio de role afecta el ranking público y la home.
  revalidatePath("/ranking");
  revalidatePath("/");
  return { success: true };
}

export async function resetUserPassword(
  userId: string,
  newPassword: string
): Promise<{ success?: boolean; error?: string }> {
  await verifyAdmin();
  const adminSupabase = createAdminClient();

  const { error } = await adminSupabase.auth.admin.updateUserById(userId, {
    password: newPassword,
  });

  if (error) return { error: error.message };
  return { success: true };
}

export async function updateUserAvatar(
  profileId: string,
  userId: string,
  formData: FormData
): Promise<{ success?: boolean; url?: string; error?: string }> {
  await verifyAdmin();
  const adminSupabase = createAdminClient();

  const file = formData.get("file") as File;
  if (!file || file.size === 0) return { error: "No se seleccionó archivo" };
  if (file.size > 2 * 1024 * 1024) return { error: "Máximo 2MB" };

  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${userId}/avatar.${ext}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { error: uploadError } = await adminSupabase.storage
    .from("avatars")
    .upload(path, buffer, {
      upsert: true,
      contentType: file.type,
    });

  if (uploadError) return { error: "Error al subir: " + uploadError.message };

  const { data: urlData } = adminSupabase.storage
    .from("avatars")
    .getPublicUrl(path);

  const url = urlData.publicUrl + "?t=" + Date.now();

  await adminSupabase
    .from("profiles")
    .update({ avatar_url: url })
    .eq("id", profileId);

  revalidatePath(`/admin/usuarios/${profileId}`);
  revalidatePath("/admin/usuarios");
  return { success: true, url };
}

export async function removeUserAvatar(
  profileId: string
): Promise<{ success?: boolean; error?: string }> {
  await verifyAdmin();
  const adminSupabase = createAdminClient();

  await adminSupabase
    .from("profiles")
    .update({ avatar_url: null })
    .eq("id", profileId);

  revalidatePath(`/admin/usuarios/${profileId}`);
  revalidatePath("/admin/usuarios");
  return { success: true };
}

// ─── Propiedades ──────────────────────────────────────────────────────────────

export async function getAdminProperties(): Promise<AdminProperty[]> {
  const { supabase } = await verifyAdmin();

  const { data, error } = await supabase
    .from("properties")
    .select(
      "id, agent_id, title, slug, price, currency, operation, type, district, city, is_active, featured, created_at, agent:profiles!agent_id(full_name, phone)"
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

// ─── Enhanced Stats ──────────────────────────────────────────────────────────

export async function getEnhancedAdminStats(): Promise<EnhancedAdminStats> {
  const { supabase } = await verifyAdmin();

  const [
    { count: totalUsers },
    { count: totalAgents },
    { count: totalBasicUsers },
    { count: activeProperties },
    { count: soldProperties },
    { count: newLeads },
    { count: contactedLeads },
    { count: closedLeads },
    { count: totalPosts },
    { count: totalTrainings },
    { count: totalEnrollments },
    { data: commissionsData },
    { data: paidEnrollments },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "agent"),
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "user"),
    supabase
      .from("properties")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true),
    supabase
      .from("properties")
      .select("*", { count: "exact", head: true })
      .eq("status", "sold")
      .eq("sale_approved", true),
    supabase
      .from("inquiries")
      .select("*", { count: "exact", head: true })
      .eq("status", "new"),
    supabase
      .from("inquiries")
      .select("*", { count: "exact", head: true })
      .eq("status", "contacted"),
    supabase
      .from("inquiries")
      .select("*", { count: "exact", head: true })
      .eq("status", "closed"),
    supabase.from("blog_posts").select("*", { count: "exact", head: true }),
    supabase.from("trainings").select("*", { count: "exact", head: true }),
    supabase
      .from("training_enrollments")
      .select("*", { count: "exact", head: true })
      .eq("payment_status", "paid"),
    supabase
      .from("properties")
      .select("commission_amount")
      .eq("sale_approved", true)
      .not("commission_amount", "is", null),
    supabase
      .from("training_enrollments")
      .select("training_id, trainings(price)")
      .eq("payment_status", "paid"),
  ]);

  // Sum commissions
  const totalCommissions = (commissionsData ?? []).reduce(
    (sum, row) => sum + (row.commission_amount ?? 0),
    0
  );

  // Sum training revenue
  const trainingRevenue = (paidEnrollments ?? []).reduce((sum, row) => {
    const training = Array.isArray(row.trainings)
      ? row.trainings[0]
      : row.trainings;
    return sum + ((training as { price: number } | null)?.price ?? 0);
  }, 0);

  const approvedSalesCount = soldProperties ?? 0;

  return {
    totalUsers: totalUsers ?? 0,
    totalAgents: totalAgents ?? 0,
    totalBasicUsers: totalBasicUsers ?? 0,
    activeProperties: activeProperties ?? 0,
    soldProperties: soldProperties ?? 0,
    newLeads: newLeads ?? 0,
    contactedLeads: contactedLeads ?? 0,
    closedLeads: closedLeads ?? 0,
    totalPosts: totalPosts ?? 0,
    totalTrainings: totalTrainings ?? 0,
    totalEnrollments: totalEnrollments ?? 0,
    approvedSalesCount,
    totalCommissions: Math.round(totalCommissions * 100) / 100,
    trainingRevenue: Math.round(trainingRevenue * 100) / 100,
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

  // Capturamos el slug antes de borrar para invalidar el detalle público.
  const { data: prop } = await supabase
    .from("properties")
    .select("slug")
    .eq("id", id)
    .maybeSingle();

  await supabase.from("property_images").delete().eq("property_id", id);
  const { error } = await supabase.from("properties").delete().eq("id", id);
  if (error) return { error: error.message };

  // Invalidar listados públicos (ISR) y privados.
  revalidatePath("/");
  revalidatePath("/propiedades");
  if (prop?.slug) revalidatePath(`/propiedades/${prop.slug}`);
  revalidatePath("/admin/propiedades");
  revalidatePath("/dashboard/propiedades");
  revalidatePath("/ranking");
  revalidatePath("/admin/ranking");

  // Borrar afecta properties_count del agente → recalcular ranking.
  try {
    await recalculateRankings();
  } catch {
    // No abortamos el delete si el recálculo falla.
  }

  return { success: true };
}

// ─── Crear Usuarios ──────────────────────────────────────────────────────────

export async function createUser(data: {
  email: string;
  full_name: string;
  role: string;
  phone?: string;
}): Promise<{ success?: boolean; error?: string }> {
  await verifyAdmin();
  const adminSupabase = createAdminClient();

  // Validar teléfono duplicado
  if (data.phone?.trim()) {
    const { data: existing } = await adminSupabase
      .from("profiles")
      .select("id")
      .eq("phone", data.phone.trim())
      .limit(1);

    if ((existing ?? []).length > 0) {
      return { error: "Este número de teléfono ya está registrado." };
    }
  }

  // Normalizar nombre
  const normalizedName = data.full_name
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());

  // Crear usuario en Supabase Auth (email_confirm: true = ya verificado)
  const { data: authData, error: authError } =
    await adminSupabase.auth.admin.createUser({
      email: data.email.trim().toLowerCase(),
      email_confirm: true,
      user_metadata: { full_name: normalizedName },
    });

  if (authError) {
    if (authError.message.includes("already") || authError.message.includes("exists")) {
      return { error: "Este correo ya está registrado." };
    }
    return { error: authError.message };
  }

  // Crear perfil con rol y datos adicionales
  const { error: profileError } = await adminSupabase.from("profiles").upsert(
    {
      user_id: authData.user.id,
      full_name: normalizedName,
      phone: data.phone?.trim() || null,
      role: data.role,
      is_active: true,
    },
    { onConflict: "user_id" }
  );

  if (profileError) return { error: profileError.message };

  revalidatePath("/admin/usuarios");
  return { success: true };
}

// ─── Eliminar Usuarios ────────────────────────────────────────────────────────

export async function deleteUser(profileId: string) {
  await verifyAdmin();
  const adminSupabase = createAdminClient();

  // Obtener user_id
  const { data: profile } = await adminSupabase
    .from("profiles")
    .select("user_id")
    .eq("id", profileId)
    .single();

  if (!profile) return { error: "Usuario no encontrado" };

  // 1. Eliminar imágenes de propiedades del usuario
  const { data: properties } = await adminSupabase
    .from("properties")
    .select("id")
    .eq("agent_id", profileId);

  for (const prop of properties ?? []) {
    await adminSupabase.from("property_images").delete().eq("property_id", prop.id);
  }

  // 2. Eliminar propiedades
  await adminSupabase.from("properties").delete().eq("agent_id", profileId);

  // 3. Eliminar blog posts
  await adminSupabase.from("blog_posts").delete().eq("author_id", profileId);

  // 4. Eliminar rankings
  await adminSupabase.from("agent_rankings").delete().eq("agent_id", profileId);

  // 5. Eliminar suscripciones
  await adminSupabase.from("agent_subscriptions").delete().eq("profile_id", profileId);

  // 6. Eliminar enrollments
  await adminSupabase.from("training_enrollments").delete().eq("user_id", profile.user_id);

  // 7. Eliminar profile
  const { error } = await adminSupabase.from("profiles").delete().eq("id", profileId);
  if (error) return { error: error.message };

  // 8. Eliminar de auth.users
  await adminSupabase.auth.admin.deleteUser(profile.user_id);

  revalidatePath("/admin/usuarios");
  revalidatePath("/admin/propiedades");
  revalidatePath("/admin/blog");
  revalidatePath("/admin/ranking");
  return { success: true };
}

// ─── Eliminar Leads ───────────────────────────────────────────────────────────

export async function deleteInquiry(id: string) {
  const { supabase } = await verifyAdmin();
  const { data, error } = await supabase
    .from("inquiries")
    .delete()
    .eq("id", id)
    .select("id");
  if (error) return { error: error.message };
  if (!data || data.length === 0) {
    return { error: "No se pudo eliminar la consulta (verifica permisos)." };
  }
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

  // Obtener datos de la propiedad para calcular comisión
  const { data: property } = await supabase
    .from("properties")
    .select("sale_price, currency")
    .eq("id", propertyId)
    .eq("status", "sold")
    .single();

  if (!property) return { error: "Propiedad no encontrada" };

  // Obtener configuración de comisión
  const { data: settingsData } = await supabase
    .from("platform_settings")
    .select("key, value");

  const settings: Record<string, string> = {};
  for (const row of settingsData ?? []) {
    settings[row.key] = row.value;
  }

  const commissionPct = parseFloat(settings.commission_percentage ?? "5");
  const commissionCurrency = settings.commission_currency ?? "PEN";
  const usdToPen = parseFloat(settings.usd_to_pen_rate ?? "3.7");

  // Calcular comisión
  let saleAmount = property.sale_price ?? 0;

  // Convertir si la venta es en USD y la comisión en PEN (o viceversa)
  if (property.currency === "USD" && commissionCurrency === "PEN") {
    saleAmount = saleAmount * usdToPen;
  } else if (property.currency === "PEN" && commissionCurrency === "USD") {
    saleAmount = saleAmount / usdToPen;
  }

  const commissionAmount = Math.round(saleAmount * (commissionPct / 100) * 100) / 100;

  // Aprobar venta y guardar comisión
  const { error } = await supabase
    .from("properties")
    .update({
      sale_approved: true,
      commission_amount: commissionAmount,
      commission_currency: commissionCurrency,
    })
    .eq("id", propertyId);

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
