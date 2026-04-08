import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { getAdminServices } from "@/features/admin/services/admin-actions";
import { ServiciosTable } from "@/features/admin/components/servicios-table";

export default async function AdminServiciosPage() {
  const services = await getAdminServices();

  const active = services.filter((s) => s.is_active).length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#1f2937]">Servicios</h2>
        <p className="mt-1 text-sm text-gray-500">
          Gestiona los servicios que se muestran en la plataforma
        </p>
      </div>

      {/* Mini stats */}
      <div className="flex gap-3">
        <div className="rounded-lg border border-gray-200 bg-white px-4 py-3">
          <p className="text-xl font-bold text-[#1f2937]">{services.length}</p>
          <p className="text-xs text-gray-400">Total</p>
        </div>
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3">
          <p className="text-xl font-bold text-green-700">{active}</p>
          <p className="text-xs text-green-600">Activos</p>
        </div>
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-xl font-bold text-red-600">{services.length - active}</p>
          <p className="text-xs text-red-500">Inactivos</p>
        </div>
      </div>

      <Card className="border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-[#1f2937]">
            Todos los servicios ({services.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ServiciosTable services={services} />
        </CardContent>
      </Card>
    </div>
  );
}
