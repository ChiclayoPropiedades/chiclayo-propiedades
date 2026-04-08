import { createClient } from "@/shared/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { RecalcularRankingButton } from "@/features/admin/components/recalcular-ranking-button";

interface RankingRow {
  id: string;
  agent_id: string;
  score: number;
  properties_count: number;
  inquiries_count: number;
  period: string;
  agent: { full_name: string | null; phone: string | null } | null;
}

async function getRankings(): Promise<RankingRow[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("agent_rankings")
    .select(
      "id, agent_id, score, properties_count, inquiries_count, period, agent:profiles(full_name, phone)"
    )
    .order("score", { ascending: false });

  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => ({
    ...row,
    agent: Array.isArray(row.agent) ? row.agent[0] ?? null : row.agent,
  })) as RankingRow[];
}

export default async function AdminRankingPage() {
  const rankings = await getRankings();
  const currentPeriod = new Date().toISOString().slice(0, 7);

  const periodRankings = rankings.filter((r) => r.period === currentPeriod);
  const otherRankings = rankings.filter((r) => r.period !== currentPeriod);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1f2937]">Ranking de Agentes</h2>
          <p className="mt-1 text-sm text-gray-500">
            Recalcula y gestiona el ranking de agentes inmobiliarios
          </p>
        </div>
        <RecalcularRankingButton />
      </div>

      {/* Info del algoritmo */}
      <div className="rounded-lg border border-[#eff6ff] bg-[#eff6ff] p-4">
        <p className="text-sm font-medium text-[#2563eb]">Algoritmo de puntuación</p>
        <p className="mt-1 text-xs text-[#1e40af]">
          Cada propiedad activa suma <strong>10 puntos</strong>. Cada consulta recibida suma{" "}
          <strong>5 puntos</strong>. El período es mensual (YYYY-MM).
        </p>
      </div>

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
              No hay rankings para el período actual. Haz clic en &quot;Recalcular Rankings&quot; para generarlos.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-gray-200 bg-gray-50">
                  <TableHead className="text-xs font-medium text-gray-500">#</TableHead>
                  <TableHead className="text-xs font-medium text-gray-500">Agente</TableHead>
                  <TableHead className="text-xs font-medium text-gray-500">Teléfono</TableHead>
                  <TableHead className="text-xs font-medium text-gray-500">Propiedades</TableHead>
                  <TableHead className="text-xs font-medium text-gray-500">Consultas</TableHead>
                  <TableHead className="text-xs font-medium text-gray-500">Puntuación</TableHead>
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
                    <TableCell className="font-medium text-[#1f2937]">
                      {row.agent?.full_name ?? "Agente desconocido"}
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {row.agent?.phone ?? <span className="text-gray-300">—</span>}
                    </TableCell>
                    <TableCell className="text-center text-sm text-gray-700">
                      {row.properties_count}
                    </TableCell>
                    <TableCell className="text-center text-sm text-gray-700">
                      {row.inquiries_count}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full border border-[#2563eb]/20 bg-[#eff6ff] px-2.5 py-0.5 text-sm font-bold text-[#2563eb]">
                        {row.score} pts
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
                  <TableHead className="text-xs font-medium text-gray-500">Período</TableHead>
                  <TableHead className="text-xs font-medium text-gray-500">Agente</TableHead>
                  <TableHead className="text-xs font-medium text-gray-500">Propiedades</TableHead>
                  <TableHead className="text-xs font-medium text-gray-500">Consultas</TableHead>
                  <TableHead className="text-xs font-medium text-gray-500">Puntuación</TableHead>
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
                    <TableCell className="text-center text-sm text-gray-500">
                      {row.properties_count}
                    </TableCell>
                    <TableCell className="text-center text-sm text-gray-500">
                      {row.inquiries_count}
                    </TableCell>
                    <TableCell className="text-sm font-medium text-gray-700">
                      {row.score} pts
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
