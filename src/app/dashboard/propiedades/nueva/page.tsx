import { type Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { createClient } from "@/shared/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { PropertyForm } from "@/features/properties/components/property-form";
import { createProperty } from "@/features/properties/services/property-actions";

export const metadata: Metadata = {
  title: "Nueva Propiedad",
};

export default async function NuevaPropiedadPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

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
        <h1 className="text-2xl font-bold text-[#1f2937]">Nueva Propiedad</h1>
        <p className="mt-1 text-sm text-gray-500">
          Completa los datos para publicar tu propiedad en Chiclayo Propiedades
        </p>
      </div>

      <Card className="border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-[#1f2937]">
            Información de la propiedad
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PropertyForm action={createProperty} />
        </CardContent>
      </Card>
    </div>
  );
}
