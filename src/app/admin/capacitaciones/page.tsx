import Link from "next/link";
import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { getAdminTrainings } from "@/features/admin/services/admin-actions";
import { CapacitacionesTable } from "@/features/admin/components/capacitaciones-table";

export default async function AdminCapacitacionesPage() {
  const trainings = await getAdminTrainings();

  const active = trainings.filter((t) => t.is_active).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#1f2937]">Capacitaciones</h2>
          <p className="mt-1 text-sm text-gray-500">
            Gestiona las capacitaciones y talleres disponibles
          </p>
        </div>
        <Link
          href="/admin/capacitaciones/nueva"
          className="inline-flex items-center gap-2 rounded-lg bg-[#2563eb] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1e40af]"
        >
          <Plus className="size-4" />
          Nueva Capacitación
        </Link>
      </div>

      {/* Mini stats */}
      <div className="flex gap-3">
        <div className="rounded-lg border border-gray-200 bg-white px-4 py-3">
          <p className="text-xl font-bold text-[#1f2937]">{trainings.length}</p>
          <p className="text-xs text-gray-400">Total</p>
        </div>
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3">
          <p className="text-xl font-bold text-green-700">{active}</p>
          <p className="text-xs text-green-600">Activas</p>
        </div>
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-xl font-bold text-red-600">{trainings.length - active}</p>
          <p className="text-xs text-red-500">Inactivas</p>
        </div>
      </div>

      <Card className="border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-[#1f2937]">
            Todas las capacitaciones ({trainings.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <CapacitacionesTable trainings={trainings} />
        </CardContent>
      </Card>
    </div>
  );
}
