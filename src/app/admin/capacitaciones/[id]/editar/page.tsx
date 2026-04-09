import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { getTrainingById, updateTraining } from "@/features/admin/services/training-actions";
import { TrainingForm } from "@/features/admin/components/training-form";

interface AdminCapacitacionEditarPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminCapacitacionEditarPage({
  params,
}: AdminCapacitacionEditarPageProps) {
  const { id } = await params;

  const training = await getTrainingById(id);

  if (!training) notFound();

  const boundUpdateTraining = updateTraining.bind(null, id);

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
        <h2 className="text-2xl font-bold text-[#1f2937]">Editar Capacitación</h2>
        <p className="mt-1 text-sm text-gray-500">
          Modifica los datos de la capacitación
        </p>
      </div>

      <Card className="border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-[#1f2937]">
            Información de la capacitación
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TrainingForm
            initialData={{
              title: training.title,
              description: training.description,
              content: training.content,
              price: training.price,
              currency: training.currency,
              modality: training.modality,
              location: training.location,
              instructor: training.instructor,
              event_date: training.event_date,
            }}
            action={boundUpdateTraining}
          />
        </CardContent>
      </Card>
    </div>
  );
}
