import Link from "next/link";
import {
  Plus,
  GraduationCap,
  Users,
  BookOpen,
  CheckCircle2,
  XCircle,
  Clock,
  UserCheck,
} from "lucide-react";
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
  const failedEnrollments = enrollments.filter((e) => e.payment_status === "failed").length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#1f2937]">Capacitaciones</h2>
          <p className="mt-1 text-sm text-gray-500">
            Gestiona capacitaciones, talleres e inscripciones de agentes
          </p>
        </div>
        <Link
          href="/admin/capacitaciones/nueva"
          className="inline-flex items-center gap-2 rounded-xl bg-[#2563eb] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#1e40af] hover:shadow-md"
        >
          <Plus className="size-4" />
          Nueva Capacitacion
        </Link>
      </div>

      {/* Stats Grid — 2 filas logicas */}
      <div className="space-y-3">
        {/* Fila 1: Capacitaciones */}
        <div className="grid grid-cols-3 gap-3">
          <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-100">
              <BookOpen className="size-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1f2937]">{trainings.length}</p>
              <p className="text-xs font-medium text-gray-500">Capacitaciones</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50/50 p-4 shadow-sm">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-green-100">
              <CheckCircle2 className="size-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-700">{activeTrainings}</p>
              <p className="text-xs font-medium text-green-600">Activas</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50/50 p-4 shadow-sm">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-red-100">
              <XCircle className="size-5 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">{trainings.length - activeTrainings}</p>
              <p className="text-xs font-medium text-red-500">Inactivas</p>
            </div>
          </div>
        </div>

        {/* Fila 2: Inscripciones */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="flex items-center gap-3 rounded-xl border border-indigo-200 bg-indigo-50/50 p-4 shadow-sm">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-indigo-100">
              <Users className="size-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-indigo-700">{enrollments.length}</p>
              <p className="text-xs font-medium text-indigo-600">Inscripciones</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50/50 p-4 shadow-sm">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-amber-100">
              <Clock className="size-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-700">{pendingEnrollments}</p>
              <p className="text-xs font-medium text-amber-600">Pago pendiente</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 shadow-sm">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100">
              <UserCheck className="size-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-700">{paidEnrollments}</p>
              <p className="text-xs font-medium text-emerald-600">Pagados</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50/50 p-4 shadow-sm">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-gray-100">
              <XCircle className="size-5 text-gray-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-600">{failedEnrollments}</p>
              <p className="text-xs font-medium text-gray-500">Rechazados</p>
            </div>
          </div>
        </div>
      </div>

      {/* Inscripciones */}
      <Card className="overflow-hidden rounded-xl border-gray-200 shadow-sm">
        <CardHeader className="border-b border-gray-100 bg-gray-50/50 pb-4">
          <CardTitle className="flex items-center gap-2.5 text-base font-bold text-[#1f2937]">
            <div className="flex size-8 items-center justify-center rounded-lg bg-indigo-100">
              <Users className="size-4 text-indigo-600" />
            </div>
            Inscripciones
            <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-700">
              {enrollments.length}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <EnrollmentsTable enrollments={enrollments} />
        </CardContent>
      </Card>

      {/* Capacitaciones */}
      <Card className="overflow-hidden rounded-xl border-gray-200 shadow-sm">
        <CardHeader className="border-b border-gray-100 bg-gray-50/50 pb-4">
          <CardTitle className="flex items-center gap-2.5 text-base font-bold text-[#1f2937]">
            <div className="flex size-8 items-center justify-center rounded-lg bg-blue-100">
              <GraduationCap className="size-4 text-blue-600" />
            </div>
            Todas las capacitaciones
            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
              {trainings.length}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <CapacitacionesTable trainings={trainings} />
        </CardContent>
      </Card>
    </div>
  );
}
