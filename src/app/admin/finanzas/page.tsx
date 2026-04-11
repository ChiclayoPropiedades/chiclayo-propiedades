import {
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  Banknote,
  GraduationCap,
  Wallet,
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
  getFinanceSummary,
  getSalesRecords,
  getEnrollmentRecords,
} from "@/features/admin/services/finance-actions";

function formatPrice(price: number, currency: string) {
  const symbol = currency === "USD" ? "$" : "S/";
  return `${symbol} ${price.toLocaleString("es-PE")}`;
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  bg,
}: {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bg: string;
}) {
  return (
    <Card className="border-gray-200">
      <CardContent className="p-4">
        <div className={`mb-3 inline-flex rounded-lg p-2 ${bg}`}>
          <Icon className={`size-5 ${color}`} aria-hidden="true" />
        </div>
        <p className="text-2xl font-bold text-[#1f2937]">{value}</p>
        <p className="mt-0.5 text-xs text-gray-500">{label}</p>
      </CardContent>
    </Card>
  );
}

export default async function AdminFinanzasPage() {
  const [summary, sales, enrollments] = await Promise.all([
    getFinanceSummary(),
    getSalesRecords(),
    getEnrollmentRecords(),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-[#1f2937]">Finanzas</h2>
        <p className="mt-1 text-sm text-gray-500">
          Resumen de ingresos, comisiones y ventas de la plataforma
        </p>
      </div>

      {/* Resumen financiero */}
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400">
          Resumen
        </h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard
            label="Ingresos Totales"
            value={`S/ ${summary.totalRevenue.toLocaleString("es-PE")}`}
            icon={Wallet}
            color="text-green-600"
            bg="bg-green-50"
          />
          <StatCard
            label="Comisiones Cobradas"
            value={`S/ ${summary.totalCommissions.toLocaleString("es-PE")}`}
            icon={DollarSign}
            color="text-blue-600"
            bg="bg-blue-50"
          />
          <StatCard
            label="Ingresos Capacitaciones"
            value={`S/ ${summary.totalTrainingRevenue.toLocaleString("es-PE")}`}
            icon={GraduationCap}
            color="text-amber-600"
            bg="bg-amber-50"
          />
          <StatCard
            label="Monto Total Ventas"
            value={`S/ ${summary.totalSalesAmount.toLocaleString("es-PE")}`}
            icon={TrendingUp}
            color="text-purple-600"
            bg="bg-purple-50"
          />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <StatCard
            label="Ventas Aprobadas"
            value={summary.approvedSales}
            icon={CheckCircle2}
            color="text-emerald-600"
            bg="bg-emerald-50"
          />
          <StatCard
            label="Ventas Pendientes"
            value={summary.pendingSales}
            icon={Clock}
            color="text-yellow-600"
            bg="bg-yellow-50"
          />
          <StatCard
            label="Total Ventas"
            value={summary.totalSales}
            icon={Banknote}
            color="text-gray-600"
            bg="bg-gray-100"
          />
        </div>
      </div>

      {/* Tabla de ventas */}
      <Card className="border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-[#1f2937]">
            Historial de Ventas
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {sales.length === 0 ? (
            <p className="px-6 py-12 text-center text-sm text-gray-400">
              No hay ventas registradas aún. Las ventas aparecerán aquí cuando
              los agentes marquen propiedades como vendidas.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-200 bg-gray-50">
                    <TableHead className="text-xs font-medium text-gray-500">
                      Propiedad
                    </TableHead>
                    <TableHead className="text-xs font-medium text-gray-500">
                      Agente
                    </TableHead>
                    <TableHead className="text-xs font-medium text-gray-500">
                      Precio Venta
                    </TableHead>
                    <TableHead className="text-xs font-medium text-gray-500">
                      Comisión
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
                  {sales.map((sale) => (
                    <TableRow key={sale.id} className="border-gray-100">
                      <TableCell>
                        <div className="min-w-0">
                          <p className="max-w-[200px] truncate font-medium text-[#1f2937]">
                            {sale.title}
                          </p>
                          <p className="text-xs text-gray-400">
                            Precio lista: {formatPrice(sale.price, sale.currency)}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-700">
                            {sale.agent_name}
                          </p>
                          {sale.agent_phone && (
                            <p className="text-xs text-gray-400">
                              {sale.agent_phone}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold text-[#1f2937]">
                        {formatPrice(sale.sale_price, sale.currency)}
                      </TableCell>
                      <TableCell>
                        {sale.commission_amount ? (
                          <span className="font-semibold text-green-700">
                            {formatPrice(
                              sale.commission_amount,
                              sale.commission_currency ?? "PEN"
                            )}
                          </span>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            sale.sale_approved
                              ? "border-green-200 bg-green-100 text-green-800"
                              : "border-yellow-200 bg-yellow-100 text-yellow-800"
                          }
                        >
                          {sale.sale_approved ? "Aprobada" : "Pendiente"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-400">
                        {formatDate(sale.sale_date)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabla de pagos de capacitaciones */}
      <Card className="border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-[#1f2937]">
            Pagos de Capacitaciones
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {enrollments.length === 0 ? (
            <p className="px-6 py-12 text-center text-sm text-gray-400">
              No hay pagos de capacitaciones aún. Los pagos aparecerán aquí
              cuando los usuarios se inscriban y paguen por Stripe.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-200 bg-gray-50">
                    <TableHead className="text-xs font-medium text-gray-500">
                      Capacitación
                    </TableHead>
                    <TableHead className="text-xs font-medium text-gray-500">
                      Usuario
                    </TableHead>
                    <TableHead className="text-xs font-medium text-gray-500">
                      Monto
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
                  {enrollments.map((enrollment) => (
                    <TableRow key={enrollment.id} className="border-gray-100">
                      <TableCell className="font-medium text-[#1f2937]">
                        {enrollment.training_title}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {enrollment.user_name}
                      </TableCell>
                      <TableCell className="font-semibold text-[#1f2937]">
                        {formatPrice(
                          enrollment.training_price,
                          enrollment.training_currency
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="border-green-200 bg-green-100 text-green-800"
                        >
                          Pagado
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-400">
                        {formatDate(enrollment.enrolled_at)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
