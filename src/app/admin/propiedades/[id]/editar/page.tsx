import { type Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/shared/lib/supabase/server";
import { PropertyForm } from "@/features/properties/components/property-form";
import { updateProperty } from "@/features/properties/services/property-actions";

export const metadata: Metadata = {
  title: "Editar Propiedad | Admin",
};

export default async function AdminEditarPropiedadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  // Verificar que es admin
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/dashboard");

  // Obtener la propiedad (sin restricción de owner)
  const { data: property } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .single();

  if (!property) notFound();

  const boundUpdate = updateProperty.bind(null, id);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1f2937]">Editar Propiedad</h1>
        <p className="text-sm text-gray-500">
          Editando: {property.title}
        </p>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <PropertyForm initialData={property} action={boundUpdate} />
      </div>
    </div>
  );
}
