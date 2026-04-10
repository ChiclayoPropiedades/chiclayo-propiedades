import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";

import { createClient } from "@/shared/lib/supabase/server";
import { DashboardPropertiesView } from "@/app/dashboard/propiedades/dashboard-properties-view";

export default async function AdminPropiedadesPage() {
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

  if (profile?.role !== "admin") redirect("/dashboard");

  const { data: properties } = await supabase
    .from("properties")
    .select(
      "id, title, slug, price, currency, operation, type, district, is_active, featured, status, sale_price, sale_approved, bedrooms, bathrooms, area_m2, created_at, agent:profiles!agent_id(full_name, phone), property_images(url, is_cover)"
    )
    .order("created_at", { ascending: false });

  const allProperties = properties ?? [];
  const active = allProperties.filter((p) => p.is_active).length;
  const featured = allProperties.filter((p) => p.featured).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#1f2937]">Propiedades</h2>
          <p className="mt-1 text-sm text-gray-500">
            {allProperties.length} propiedades — {active} activas — {featured}{" "}
            destacadas
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

      {allProperties.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white py-16">
          <p className="text-lg font-semibold text-[#1f2937]">
            No hay propiedades publicadas
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Las propiedades aparecerán aquí cuando los agentes las publiquen
          </p>
        </div>
      ) : (
        <DashboardPropertiesView
          properties={allProperties}
          isAdmin={true}
        />
      )}
    </div>
  );
}
