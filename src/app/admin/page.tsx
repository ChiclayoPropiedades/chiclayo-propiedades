import Link from "next/link";
import {
  Users,
  UserCheck,
  UserRound,
  Home,
  CheckCircle2,
  MessageSquare,
  Phone,
  Archive,
  FileText,
  GraduationCap,
  Trophy,
  DollarSign,
  Banknote,
  Bell,
  UserPlus,
  FileCheck,
  Clock,
  ChevronRight,
  AlertCircle,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Badge } from "@/shared/components/ui/badge";
import {
  getEnhancedAdminStats,
  getAdminInquiries,
} from "@/features/admin/services/admin-actions";
import {
  getLeadsByMonth,
  getPropertiesByType,
  getSalesByPeriod,
} from "@/features/admin/services/chart-data-actions";
import { getAdminNotifications } from "@/features/admin/services/notifications-actions";
import { LeadsByMonthChart } from "@/features/admin/components/charts/leads-by-month-chart";
import { PropertiesByTypeChart } from "@/features/admin/components/charts/properties-by-type-chart";
import { SalesByPeriodChart } from "@/features/admin/components/charts/sales-by-period-chart";

const statusLabels: Record<string, string> = {
  new: "Nuevo",
  contacted: "Contactado",
  closed: "Cerrado",
};

const statusColors: Record<string, string> = {
  new: "bg-blue-100 text-blue-800 border-blue-200",
  contacted: "bg-yellow-100 text-yellow-800 border-yellow-200",
  closed: "bg-gray-100 text-gray-600 border-gray-200",
};

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  bg,
  suffix,
}: {
  label: string;
  value: number | string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bg: string;
  suffix?: string;
}) {
  return (
    <Card className="border-gray-200">
      <CardContent className="p-4">
        <div className={`mb-3 inline-flex rounded-lg p-2 ${bg}`}>
          <Icon className={`size-5 ${color}`} aria-hidden="true" />
        </div>
        <p className="text-2xl font-bold text-[#1f2937]">
          {value}
          {suffix && (
            <span className="ml-1 text-sm font-normal text-gray-400">
              {suffix}
            </span>
          )}
        </p>
        <p className="mt-0.5 text-xs text-gray-500">{label}</p>
      </CardContent>
    </Card>
  );
}

export default async function AdminDashboardPage() {
  const [stats, inquiries, leadsByMonth, propertiesByType, salesByPeriod, notifications] =
    await Promise.all([
      getEnhancedAdminStats(),
      getAdminInquiries(),
      getLeadsByMonth(),
      getPropertiesByType(),
      getSalesByPeriod(),
      getAdminNotifications(),
    ]);

  const recentLeads = inquiries.slice(0, 5);
  const totalPending =
    notifications.pendingRoleUpgrades +
    notifications.pendingPublicationRequests +
    notifications.pendingEnrollments +
    notifications.pendingSales +
    notifications.newLeads;

  const notificationItems = [
    {
      count: notifications.pendingRoleUpgrades,
      label: "Solicitudes de cambio de rol",
      href: "/admin/usuarios",
      icon: UserPlus,
      color: "text-purple-600",
      bg: "bg-purple-50",
      border: "border-purple-200",
    },
    {
      count: notifications.pendingPublicationRequests,
      label: "Solicitudes de publicacion",
      href: "/admin/propiedades",
      icon: FileCheck,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-200",
    },
    {
      count: notifications.pendingEnrollments,
      label: "Inscripciones pendientes de pago",
      href: "/admin/capacitaciones",
      icon: GraduationCap,
      color: "text-teal-600",
      bg: "bg-teal-50",
      border: "border-teal-200",
    },
    {
      count: notifications.pendingSales,
      label: "Ventas pendientes de aprobacion",
      href: "/admin/ranking",
      icon: Trophy,
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-200",
    },
    {
      count: notifications.newLeads,
      label: "Leads nuevos sin atender",
      href: "/admin/leads",
      icon: MessageSquare,
      color: "text-green-600",
      bg: "bg-green-50",
      border: "border-green-200",
    },
  ].filter((item) => item.count > 0);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-[#1f2937]">Dashboard</h2>
        <p className="mt-1 text-sm text-gray-500">
          Resumen general de la plataforma
        </p>
      </div>

      {/* NOTIFICACIONES / SOLICITUDES PENDIENTES */}
      {totalPending > 0 && (
        <Card className="overflow-hidden rounded-xl border-amber-200 shadow-sm">
          <CardHeader className="border-b border-amber-100 bg-amber-50/50 pb-3">
            <CardTitle className="flex items-center gap-2.5 text-base font-bold text-amber-800">
              <div className="relative flex size-8 items-center justify-center rounded-lg bg-amber-100">
                <Bell className="size-4 text-amber-600" />
                <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {totalPending}
                </span>
              </div>
              Solicitudes pendientes
            </CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-gray-100 p-0">
            {notificationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-between px-5 py-3.5 transition-colors hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex size-9 items-center justify-center rounded-lg ${item.bg}`}>
                      <Icon className={`size-4.5 ${item.color}`} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#1f2937]">
                        {item.count} {item.label}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full ${item.bg} ${item.border} border px-2.5 py-0.5 text-xs font-bold ${item.color}`}>
                      {item.count}
                    </span>
                    <ChevronRight className="size-4 text-gray-300" />
                  </div>
                </Link>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* USUARIOS */}
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400">
          Usuarios
        </h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <StatCard
            label="Total Usuarios"
            value={stats.totalUsers}
            icon={Users}
            color="text-purple-600"
            bg="bg-purple-50"
          />
          <StatCard
            label="Agentes"
            value={stats.totalAgents}
            icon={UserCheck}
            color="text-blue-600"
            bg="bg-blue-50"
          />
          <StatCard
            label="Compradores"
            value={stats.totalBasicUsers}
            icon={UserRound}
            color="text-indigo-600"
            bg="bg-indigo-50"
          />
        </div>
      </div>

      {/* PROPIEDADES */}
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400">
          Propiedades
        </h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard
            label="Activas"
            value={stats.activeProperties}
            icon={Home}
            color="text-green-600"
            bg="bg-green-50"
          />
          <StatCard
            label="Vendidas"
            value={stats.soldProperties}
            icon={CheckCircle2}
            color="text-blue-600"
            bg="bg-blue-50"
          />
          <StatCard
            label="Artículos Blog"
            value={stats.totalPosts}
            icon={FileText}
            color="text-orange-600"
            bg="bg-orange-50"
          />
          <StatCard
            label="Capacitaciones"
            value={stats.totalTrainings}
            icon={GraduationCap}
            color="text-teal-600"
            bg="bg-teal-50"
          />
        </div>
      </div>

      {/* LEADS */}
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400">
          Leads
        </h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <StatCard
            label="Nuevos"
            value={stats.newLeads}
            icon={MessageSquare}
            color="text-blue-600"
            bg="bg-blue-50"
          />
          <StatCard
            label="Contactados"
            value={stats.contactedLeads}
            icon={Phone}
            color="text-yellow-600"
            bg="bg-yellow-50"
          />
          <StatCard
            label="Cerrados"
            value={stats.closedLeads}
            icon={Archive}
            color="text-gray-600"
            bg="bg-gray-100"
          />
        </div>
      </div>

      {/* FINANZAS */}
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400">
          Finanzas
        </h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <StatCard
            label="Ventas Aprobadas"
            value={stats.approvedSalesCount}
            icon={Trophy}
            color="text-emerald-600"
            bg="bg-emerald-50"
          />
          <StatCard
            label="Comisiones Totales"
            value={`S/ ${stats.totalCommissions.toLocaleString("es-PE")}`}
            icon={DollarSign}
            color="text-green-600"
            bg="bg-green-50"
          />
          <StatCard
            label="Ingresos Capacitaciones"
            value={`S/ ${stats.trainingRevenue.toLocaleString("es-PE")}`}
            icon={Banknote}
            color="text-amber-600"
            bg="bg-amber-50"
          />
        </div>
      </div>

      {/* GRÁFICAS */}
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400">
          Gráficas
        </h3>
        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="border-gray-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-[#1f2937]">
                Leads por Mes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <LeadsByMonthChart data={leadsByMonth} />
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-[#1f2937]">
                Propiedades por Tipo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PropertiesByTypeChart data={propertiesByType} />
            </CardContent>
          </Card>
        </div>

        <div className="mt-4">
          <Card className="border-gray-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-[#1f2937]">
                Ventas por Período (S/)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SalesByPeriodChart data={salesByPeriod} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Últimos leads */}
      <Card className="border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-[#1f2937]">
            Últimos Leads
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {recentLeads.length === 0 ? (
            <p className="px-6 py-8 text-center text-sm text-gray-400">
              No hay leads registrados aún.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-gray-200 bg-gray-50">
                  <TableHead className="text-xs font-medium text-gray-500">
                    Nombre
                  </TableHead>
                  <TableHead className="text-xs font-medium text-gray-500">
                    Email
                  </TableHead>
                  <TableHead className="text-xs font-medium text-gray-500">
                    Propiedad
                  </TableHead>
                  <TableHead className="text-xs font-medium text-gray-500">
                    Estado
                  </TableHead>
                  <TableHead className="text-xs font-medium text-gray-500">
                    Fecha
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentLeads.map((lead) => (
                  <TableRow key={lead.id} className="border-gray-100">
                    <TableCell className="font-medium text-[#1f2937]">
                      {lead.name}
                    </TableCell>
                    <TableCell className="text-gray-500">{lead.email}</TableCell>
                    <TableCell className="text-gray-500">
                      {lead.property ? (
                        <span className="block max-w-[160px] truncate">
                          {lead.property.title}
                        </span>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${statusColors[lead.status] ?? ""}`}
                      >
                        {statusLabels[lead.status] ?? lead.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-400">
                      {new Date(lead.created_at).toLocaleDateString("es-PE", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
