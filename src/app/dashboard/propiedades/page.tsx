import { type Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus, Home } from "lucide-react";
import { createClient } from "@/shared/lib/supabase/server";
import { DashboardPropertiesView } from "./dashboard-properties-view";

export const metadata: Metadata = {
  title: "Mis Propiedades",
};

export default async function MisPropiedadesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, role")
    .eq("user_id", user.id)
    .single();

  if (!profile) redirect("/login");

  const isAdmin = profile.role === "admin";

  const query = supabase
    .from("properties")
    .select(
      "id, title, slug, price, currency, operation, type, district, is_active, featured, status, sale_price, sale_approved, bedrooms, bathrooms, area_m2, created_at, agent:profiles!agent_id(full_name, email, phone), property_images(url, is_cover)"
    )
    .order("created_at", { ascending: false });

  if (!isAdmin) {
    query.eq("agent_id", profile.id);
  }

  const { data: properties } = await query;
  const myProperties = properties ?? [];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1f2937]">
            {isAdmin ? "Todas las Propiedades" : "Mis Propiedades"}
          </h1>
          <p className="text-sm text-gray-500">
            {isAdmin
              ? `${myProperties.length} propiedades en la plataforma`
              : "Gestiona tus publicaciones inmobiliarias"}
          </p>
        </div>
        <Link
          href="/dashboard/propiedades/nueva"
          className="inline-flex items-center gap-2 rounded-lg bg-[#2563eb] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#1e40af]"
        >
          <Plus className="size-4" />
          Nueva Propiedad
        </Link>
      </div>

      {myProperties.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white py-16">
          <Home className="mb-4 size-12 text-gray-300" />
          <h2 className="text-lg font-semibold text-[#1f2937]">
            No hay propiedades publicadas
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Publica tu primera propiedad para empezar a recibir consultas
          </p>
          <Link
            href="/dashboard/propiedades/nueva"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#2563eb] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1e40af]"
          >
            <Plus className="size-4" />
            Publicar Propiedad
          </Link>
        </div>
      ) : (
        <DashboardPropertiesView
          properties={myProperties}
          isAdmin={isAdmin}
        />
      )}
    </div>
  );
}
