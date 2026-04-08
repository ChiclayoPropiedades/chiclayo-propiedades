import {
  Users,
  Home,
  MessageSquare,
  FileText,
  GraduationCap,
  Trophy,
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
import { getAdminStats, getAdminInquiries } from "@/features/admin/services/admin-actions";

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

export default async function AdminDashboardPage() {
  const [stats, inquiries] = await Promise.all([
    getAdminStats(),
    getAdminInquiries(),
  ]);

  const recentLeads = inquiries.slice(0, 5);

  const statCards = [
    {
      label: "Total Usuarios",
      value: stats.totalUsers,
      icon: Users,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Propiedades Activas",
      value: stats.activeProperties,
      icon: Home,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Leads Nuevos",
      value: stats.newLeads,
      icon: MessageSquare,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Artículos",
      value: stats.totalPosts,
      icon: FileText,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      label: "Capacitaciones",
      value: stats.totalTrainings,
      icon: GraduationCap,
      color: "text-teal-600",
      bg: "bg-teal-50",
    },
    {
      label: "Inscripciones pagadas",
      value: stats.totalEnrollments,
      icon: Trophy,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-[#1f2937]">Dashboard</h2>
        <p className="mt-1 text-sm text-gray-500">
          Resumen general de la plataforma
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {statCards.map(({ label, value, icon: Icon, color, bg }) => (
          <Card key={label} className="border-gray-200">
            <CardContent className="p-4">
              <div className={`mb-3 inline-flex rounded-lg p-2 ${bg}`}>
                <Icon className={`size-5 ${color}`} aria-hidden="true" />
              </div>
              <p className="text-2xl font-bold text-[#1f2937]">{value}</p>
              <p className="mt-0.5 text-xs text-gray-500">{label}</p>
            </CardContent>
          </Card>
        ))}
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
                        <span className="truncate max-w-[160px] block">
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
