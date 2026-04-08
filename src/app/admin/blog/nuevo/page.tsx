import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { NuevoPostForm } from "@/features/admin/components/nuevo-post-form";

export default function AdminBlogNuevoPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/blog"
          className="mb-3 inline-flex items-center gap-1 text-xs text-gray-400 transition-colors hover:text-[#2563eb]"
        >
          <ChevronLeft className="size-3.5" aria-hidden="true" />
          Volver al Blog
        </Link>
        <h2 className="text-2xl font-bold text-[#1f2937]">Nuevo Artículo</h2>
        <p className="mt-1 text-sm text-gray-500">
          Crea un nuevo artículo para el blog de Chiclayo Propiedades
        </p>
      </div>

      <Card className="border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-[#1f2937]">
            Información del artículo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <NuevoPostForm />
        </CardContent>
      </Card>
    </div>
  );
}
