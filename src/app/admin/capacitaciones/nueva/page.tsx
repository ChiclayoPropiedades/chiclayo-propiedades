import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { TrainingForm } from "@/features/admin/components/training-form";
import { createTraining } from "@/features/admin/services/training-actions";

export default function AdminCapacitacionNuevaPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/capacitaciones"
          className="mb-3 inline-flex items-center gap-1 text-xs text-gray-400 transition-colors hover:text-[#2563eb]"
        >
          <ChevronLeft className="size-3.5" aria-hidden="true" />
          Volver a Capacitaciones
        </Link>
        <h2 className="text-2xl font-bold text-[#1f2937]">Nueva Capacitación</h2>
        <p className="mt-1 text-sm text-gray-500">
          Crea una nueva capacitación para la plataforma
        </p>
      </div>

      <Card className="border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-[#1f2937]">
            Información de la capacitación
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TrainingForm action={createTraining} />
        </CardContent>
      </Card>
    </div>
  );
}
