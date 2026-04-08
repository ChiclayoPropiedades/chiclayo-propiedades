import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { getAdminInquiries } from "@/features/admin/services/admin-actions";
import { LeadsTable } from "@/features/admin/components/leads-table";

export default async function AdminLeadsPage() {
  const inquiries = await getAdminInquiries();

  const newCount = inquiries.filter((i) => i.status === "new").length;
  const contactedCount = inquiries.filter((i) => i.status === "contacted").length;
  const closedCount = inquiries.filter((i) => i.status === "closed").length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#1f2937]">Leads / Consultas</h2>
        <p className="mt-1 text-sm text-gray-500">
          Gestiona las consultas recibidas de potenciales clientes
        </p>
      </div>

      {/* Mini stats */}
      <div className="flex flex-wrap gap-3">
        <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3">
          <p className="text-xl font-bold text-blue-700">{newCount}</p>
          <p className="text-xs text-blue-600">Nuevos</p>
        </div>
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3">
          <p className="text-xl font-bold text-yellow-700">{contactedCount}</p>
          <p className="text-xs text-yellow-600">Contactados</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
          <p className="text-xl font-bold text-gray-600">{closedCount}</p>
          <p className="text-xs text-gray-500">Cerrados</p>
        </div>
      </div>

      <Card className="border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-[#1f2937]">
            Todas las consultas ({inquiries.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <LeadsTable inquiries={inquiries} />
        </CardContent>
      </Card>
    </div>
  );
}
