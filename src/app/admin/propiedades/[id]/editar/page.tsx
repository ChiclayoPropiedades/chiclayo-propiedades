import { type Metadata } from "next";
import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
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

  // Obtener propiedad con imágenes (sin restricción de owner)
  const { data: property } = await supabase
    .from("properties")
    .select("*, property_images(*)")
    .eq("id", id)
    .single();

  if (!property) notFound();

  const boundUpdate = updateProperty.bind(null, id);

  const images = (property.property_images ?? []).map(
    (img: {
      id: string;
      url: string;
      display_order: number;
      is_cover: boolean;
    }) => ({
      id: img.id,
      url: img.url,
      display_order: img.display_order,
      is_cover: img.is_cover,
    })
  );

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <Link
          href="/admin/propiedades"
          className="mb-3 inline-flex items-center gap-1 text-xs text-gray-400 transition-colors hover:text-[#2563eb]"
        >
          <ChevronLeft className="size-3.5" />
          Volver a Propiedades
        </Link>
        <h1 className="text-2xl font-bold text-[#1f2937]">Editar Propiedad</h1>
        <p className="text-sm text-gray-500">Editando: {property.title}</p>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <PropertyForm
          initialData={{
            id: property.id,
            title: property.title,
            description: property.description,
            price: property.price,
            currency: property.currency,
            operation: property.operation,
            type: property.type,
            bedrooms: property.bedrooms,
            bathrooms: property.bathrooms,
            area_m2: property.area_m2,
            address: property.address,
            district: property.district,
            city: property.city,
          }}
          initialImages={images}
          action={boundUpdate}
        />
      </div>
    </div>
  );
}
