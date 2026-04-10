import { type Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { createClient } from "@/shared/lib/supabase/server";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { PropertyForm } from "@/features/properties/components/property-form";
import { updateProperty } from "@/features/properties/services/property-actions";

export const metadata: Metadata = {
  title: "Editar Propiedad",
};

interface EditarPropiedadPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditarPropiedadPage({
  params,
}: EditarPropiedadPageProps) {
  const { id } = await params;

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

  // Admin puede editar cualquier propiedad, agente solo las suyas
  const query = supabase
    .from("properties")
    .select("*, property_images(*)")
    .eq("id", id);

  if (!isAdmin) {
    query.eq("agent_id", profile.id);
  }

  const { data: property } = await query.single();

  if (!property) notFound();

  const boundUpdateProperty = updateProperty.bind(null, id);

  const images = (property.property_images ?? []).map(
    (img: { id: string; url: string; display_order: number; is_cover: boolean }) => ({
      id: img.id,
      url: img.url,
      display_order: img.display_order,
      is_cover: img.is_cover,
    })
  );

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/dashboard/propiedades"
          className="mb-3 inline-flex items-center gap-1 text-xs text-gray-400 transition-colors hover:text-[#2563eb]"
        >
          <ChevronLeft className="size-3.5" aria-hidden="true" />
          Volver a Mis Propiedades
        </Link>
        <h1 className="text-2xl font-bold text-[#1f2937]">Editar Propiedad</h1>
        <p className="mt-1 text-sm text-gray-500">
          Modifica los datos y fotos de tu propiedad
        </p>
      </div>

      <Card className="border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-[#1f2937]">
            Información de la propiedad
          </CardTitle>
        </CardHeader>
        <CardContent>
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
            action={boundUpdateProperty}
          />
        </CardContent>
      </Card>
    </div>
  );
}
