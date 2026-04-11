import { createClient } from "@/shared/lib/supabase/server";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { RecalcularRankingButton } from "@/features/admin/components/recalcular-ranking-button";
import { SalesApprovalTable } from "@/features/admin/components/sales-approval-table";
import { getPendingSales } from "@/features/admin/services/admin-actions";
import { formatPrice } from "@/shared/lib/format";
import { getSettings } from "@/features/admin/services/settings-actions";

interface RankingRow {
  id: string;
  agent_id: string;
  score: number;
  properties_count: number;
  inquiries_count: number;
  sales_count: number;
  total_sales_amount: number;
  period: string;
  agent: { full_name: string | null; phone: string | null; role: string | null } | null;
}

async function getRankings(): Promise<RankingRow[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("agent_rankings")
    .select(
      "id, agent_id, score, properties_count, inquiries_count, sales_count, total_sales_amount, period, agent:profiles(full_name, phone, role)"
    )
    .order("score", { ascending: false });

  if (error) throw new Error(error.message);

  return ((data ?? []).map((row) => ({
    ...row,
    sales_count: (row as Record<string, unknown>).sales_count as number ?? 0,
    total_sales_amount: (row as Record<string, unknown>).total_sales_amount as number ?? 0,
    agent: Array.isArray(row.agent) ? row.agent[0] ?? null : row.agent,
  })) as RankingRow[]).filter((r) => r.agent?.role === "agent");
}

export default async function AdminRankingPage() {
  const [rankings, pendingSales, settings] = await Promise.all([
    getRankings(),
    getPendingSales(),
    getSettings(),
  ]);
  const currentPeriod = new Date().toISOString().slice(0, 7);

  const periodRankings = rankings.filter((r) => r.period === currentPeriod);
  const otherRankings = rankings.filter((r) => r.period !== currentPeriod);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1f2937]">
            Ranking de Agentes
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Ranking basado en ventas cerradas y monto total vendido
          </p>
        </div>
        <RecalcularRankingButton />
      </div>

      {/* Info del algoritmo */}
      <div className="rounded-lg border border-[#eff6ff] bg-[#eff6ff] p-4">
        <p className="text-sm font-medium text-[#2563eb]">
          Algoritmo de puntuación
        </p>
        <p className="mt-1 text-xs text-[#1e40af]">
          La posición se determina por el <strong>monto total vendido</strong>{" "}
          (en soles). Las ventas en dólares se convierten a soles (tasa {settings.usd_to_pen_rate}).
          Solo se cuentan ventas <strong>aprobadas por el administrador</strong>.
        </p>
      </div>

      {/* Ventas pendientes de aprobación */}
      <Card className="border-amber-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-amber-700">
            Ventas pendientes de aprobación ({pendingSales.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SalesApprovalTable sales={pendingSales} />
        </CardContent>
      </Card>

      {/* Ranking actual */}
      <Card className="border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-[#1f2937]">
            Período actual: {currentPeriod} ({periodRankings.length} agentes)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {periodRankings.length === 0 ? (
            <p className="px-6 py-10 text-center text-sm text-gray-400">
              No hay rankings para el período actual. Haz clic en
              &quot;Recalcular Rankings&quot; para generarlos.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-gray-200 bg-gray-50">
                  <TableHead className="text-xs font-medium text-gray-500">
                    #
                  </TableHead>
                  <TableHead className="text-xs font-medium text-gray-500">
                    Agente
                  </TableHead>
                  <TableHead className="text-xs font-medium text-gray-500">
                    Ventas
                  </TableHead>
                  <TableHead className="hidden text-xs font-medium text-gray-500 sm:table-cell">
                    Monto vendido
                  </TableHead>
                  <TableHead className="hidden text-xs font-medium text-gray-500 md:table-cell">
                    Propiedades
                  </TableHead>
                  <TableHead className="text-xs font-medium text-gray-500">
                    Puntuación
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {periodRankings.map((row, index) => (
                  <TableRow key={row.id} className="border-gray-100">
                    <TableCell>
                      <span
                        className={`inline-flex size-6 items-center justify-center rounded-full text-xs font-bold ${
                          index === 0
                            ? "bg-yellow-100 text-yellow-700"
                            : index === 1
                              ? "bg-gray-100 text-gray-600"
                              : index === 2
                                ? "bg-orange-100 text-orange-600"
                                : "bg-gray-50 text-gray-400"
                        }`}
                      >
                        {index + 1}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-[#1f2937]">
                          {row.agent?.full_name ?? "Agente desconocido"}
                        </p>
                        <p className="text-xs text-gray-400">
                          {row.agent?.phone ?? "—"}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-center text-sm font-semibold text-green-700">
                      {row.sales_count}
                    </TableCell>
                    <TableCell className="hidden text-sm text-gray-700 sm:table-cell">
                      {row.total_sales_amount > 0
                        ? formatPrice(row.total_sales_amount, "PEN")
                        : "—"}
                    </TableCell>
                    <TableCell className="hidden text-center text-sm text-gray-500 md:table-cell">
                      {row.properties_count}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full border border-[#2563eb]/20 bg-[#eff6ff] px-2.5 py-0.5 text-sm font-bold text-[#2563eb]">
                        {row.total_sales_amount > 0
                          ? formatPrice(row.total_sales_amount, "PEN")
                          : "0 pts"}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Períodos anteriores */}
      {otherRankings.length > 0 && (
        <Card className="border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-[#1f2937]">
              Períodos anteriores
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-200 bg-gray-50">
                  <TableHead className="text-xs font-medium text-gray-500">
                    Período
                  </TableHead>
                  <TableHead className="text-xs font-medium text-gray-500">
                    Agente
                  </TableHead>
                  <TableHead className="text-xs font-medium text-gray-500">
                    Ventas
                  </TableHead>
                  <TableHead className="text-xs font-medium text-gray-500">
                    Monto vendido
                  </TableHead>
                  <TableHead className="text-xs font-medium text-gray-500">
                    Puntuación
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {otherRankings.map((row) => (
                  <TableRow key={row.id} className="border-gray-100">
                    <TableCell className="font-mono text-xs text-gray-400">
                      {row.period}
                    </TableCell>
                    <TableCell className="font-medium text-[#1f2937]">
                      {row.agent?.full_name ?? "Agente desconocido"}
                    </TableCell>
                    <TableCell className="text-center text-sm text-green-600">
                      {row.sales_count}
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {row.total_sales_amount > 0
                        ? formatPrice(row.total_sales_amount, "PEN")
                        : "—"}
                    </TableCell>
                    <TableCell className="text-sm font-medium text-gray-700">
                      {row.total_sales_amount > 0
                        ? formatPrice(row.total_sales_amount, "PEN")
                        : "0 pts"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
