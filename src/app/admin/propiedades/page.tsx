import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { getAdminProperties } from "@/features/admin/services/admin-actions";
import { PropiedadesTable } from "@/features/admin/components/propiedades-table";

export default async function AdminPropiedadesPage() {
  const properties = await getAdminProperties();

  const active = properties.filter((p) => p.is_active).length;
  const featured = properties.filter((p) => p.featured).length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#1f2937]">Propiedades</h2>
        <p className="mt-1 text-sm text-gray-500">
          Gestiona el estado y visibilidad de las propiedades
        </p>
      </div>

      {/* Mini stats */}
      <div className="flex gap-4">
        <div className="rounded-lg border border-gray-200 bg-white px-4 py-3">
          <p className="text-xl font-bold text-[#1f2937]">{properties.length}</p>
          <p className="text-xs text-gray-400">Total</p>
        </div>
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3">
          <p className="text-xl font-bold text-green-700">{active}</p>
          <p className="text-xs text-green-600">Activas</p>
        </div>
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3">
          <p className="text-xl font-bold text-yellow-700">{featured}</p>
          <p className="text-xs text-yellow-600">Destacadas</p>
        </div>
      </div>

      <Card className="border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-[#1f2937]">
            Todas las propiedades
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <PropiedadesTable properties={properties} />
        </CardContent>
      </Card>
    </div>
  );
}
