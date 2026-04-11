import { type Metadata } from "next";
import { GraduationCap } from "lucide-react";

import { getTrainings } from "@/features/trainings/services/get-trainings";
import { TrainingCard } from "@/features/trainings/components/training-card";

export const metadata: Metadata = {
  title: "Capacitaciones",
  description:
    "Formación profesional para asesores y empresas inmobiliarias. Cursos presenciales y virtuales en Chiclayo.",
};

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-4 py-20 text-center">
      <div className="flex size-20 items-center justify-center rounded-full bg-[#eff6ff]">
        <GraduationCap className="size-10 text-[#2563eb]" aria-hidden="true" />
      </div>
      <h2 className="text-lg font-semibold text-[#1f2937]">
        Sin capacitaciones disponibles
      </h2>
      <p className="max-w-sm text-sm text-gray-500">
        Actualmente no hay capacitaciones programadas. Vuelve pronto para ver
        nuevos cursos y talleres.
      </p>
    </div>
  );
}

export default async function CapacitacionesPage() {
  const trainings = await getTrainings();

  return (
    <>
      {/* Page header */}
      <div className="bg-gradient-to-r from-[#1e3a8a] to-[#2563eb] py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <GraduationCap className="size-8 text-white/70" aria-hidden="true" />
            <div>
              <h1 className="text-2xl font-bold text-white sm:text-3xl">
                Capacitaciones
              </h1>
              <p className="mt-0.5 text-sm text-blue-100">
                Formación profesional para asesores y empresas del sector inmobiliario
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {trainings.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <p className="mb-6 text-sm text-gray-500" aria-live="polite">
              {trainings.length} capacitaci{trainings.length !== 1 ? "ones" : "ón"} disponible{trainings.length !== 1 ? "s" : ""}
            </p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {trainings.map((training) => (
                <TrainingCard key={training.id} training={training} />
              ))}
            </div>
          </>
        )}
      </section>
    </>
  );
}
