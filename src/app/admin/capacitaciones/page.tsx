import Link from "next/link";
import { Plus, GraduationCap, Clock, CheckCircle, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { getAdminTrainings } from "@/features/admin/services/admin-actions";
import { getAllEnrollments } from "@/features/admin/services/finance-actions";
import { CapacitacionesTable } from "@/features/admin/components/capacitaciones-table";
import { EnrollmentsTable } from "@/features/admin/components/enrollments-table";

export default async function AdminCapacitacionesPage() {
  const [trainings, enrollments] = await Promise.all([
    getAdminTrainings(),
    getAllEnrollments(),
  ]);

  const activeTrainings = trainings.filter((t) => t.is_active).length;
  const pendingEnrollments = enrollments.filter((e) => e.payment_status === "pending").length;
  const paidEnrollments = enrollments.filter(
    (e) => e.payment_status === "completed" || e.payment_status === "paid"
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#1f2937]">Capacitaciones</h2>
          <p className="mt-1 text-sm text-gray-500">
            Gestiona las capacitaciones, talleres e inscripciones
          </p>
        </div>
        <Link
          href="/admin/capacitaciones/nueva"
          className="inline-flex items-center gap-2 rounded-lg bg-[#2563eb] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1e40af]"
        >
          <Plus className="size-4" />
          Nueva Capacitacion
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <div className="rounded-lg border border-gray-200 bg-white px-4 py-3">
          <p className="text-xl font-bold text-[#1f2937]">{trainings.length}</p>
          <p className="text-xs text-gray-400">Capacitaciones</p>
        </div>
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3">
          <p className="text-xl font-bold text-green-700">{activeTrainings}</p>
          <p className="text-xs text-green-600">Activas</p>
        </div>
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-xl font-bold text-red-600">{trainings.length - activeTrainings}</p>
          <p className="text-xs text-red-500">Inactivas</p>
        </div>
        <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3">
          <p className="text-xl font-bold text-blue-700">{enrollments.length}</p>
          <p className="text-xs text-blue-600">Inscripciones</p>
        </div>
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
          <p className="text-xl font-bold text-amber-700">{pendingEnrollments}</p>
          <p className="text-xs text-amber-600">Pago pendiente</p>
        </div>
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3">
          <p className="text-xl font-bold text-emerald-700">{paidEnrollments}</p>
          <p className="text-xs text-emerald-600">Pagados</p>
        </div>
      </div>

      {/* Inscripciones */}
      <Card className="border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-[#1f2937]">
            <Users className="size-5" />
            Inscripciones ({enrollments.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <EnrollmentsTable enrollments={enrollments} />
        </CardContent>
      </Card>

      {/* Capacitaciones */}
      <Card className="border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-[#1f2937]">
            <GraduationCap className="size-5" />
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
