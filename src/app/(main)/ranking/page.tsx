import { type Metadata } from "next";
import Image from "next/image";
import { Trophy, Medal } from "lucide-react";

import { getRankings } from "@/features/ranking/services/get-rankings";
import type { AgentRanking } from "@/features/ranking/types";

function getAgent(entry: AgentRanking) {
  const a = Array.isArray(entry.agent) ? entry.agent[0] : entry.agent;
  return { full_name: a?.full_name ?? "Asesor", avatar_url: a?.avatar_url ?? null, phone: a?.phone ?? null };
}

export const metadata: Metadata = {
  title: "Ranking de Asesores | Chiclayo Propiedades",
  description:
    "Conoce a los mejores asesores inmobiliarios de Chiclayo Propiedades, evaluados por ventas, consultas y desempeño.",
};

function PositionBadge({ position }: { position: number }) {
  if (position === 1) {
    return (
      <span className="flex size-8 items-center justify-center rounded-full bg-yellow-400 text-sm font-extrabold text-yellow-900">
        1
      </span>
    );
  }
  if (position === 2) {
    return (
      <span className="flex size-8 items-center justify-center rounded-full bg-gray-300 text-sm font-extrabold text-gray-700">
        2
      </span>
    );
  }
  if (position === 3) {
    return (
      <span className="flex size-8 items-center justify-center rounded-full bg-orange-300 text-sm font-extrabold text-orange-900">
        3
      </span>
    );
  }
  return (
    <span className="flex size-8 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-600">
      {position}
    </span>
  );
}

function AgentAvatar({
  name,
  avatarUrl,
}: {
  name: string;
  avatarUrl: string | null;
}) {
  if (avatarUrl) {
    return (
      <div className="relative size-10 shrink-0 overflow-hidden rounded-full">
        <Image
          src={avatarUrl}
          alt={name}
          fill
          sizes="40px"
          className="object-cover"
        />
      </div>
    );
  }

  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#eff6ff] text-sm font-bold text-[#2563eb]">
      {initials}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-4 py-20 text-center">
      <div className="flex size-20 items-center justify-center rounded-full bg-[#eff6ff]">
        <Trophy className="size-10 text-[#2563eb]" aria-hidden="true" />
      </div>
      <h2 className="text-lg font-semibold text-[#1f2937]">
        Sin asesores activos
      </h2>
      <p className="max-w-sm text-sm text-gray-500">
        Actualmente no hay asesores con membresía activa registrados en el
        ranking. Vuelve pronto para ver el listado actualizado.
      </p>
    </div>
  );
}

export default async function RankingPage() {
  const rankings = await getRankings();

  return (
    <>
      {/* Page header */}
      <div className="bg-gradient-to-r from-[#1e3a8a] to-[#2563eb] py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Trophy className="size-8 text-white/70" aria-hidden="true" />
            <div>
              <h1 className="text-2xl font-bold text-white sm:text-3xl">
                Ranking de Asesores
              </h1>
              <p className="mt-0.5 text-sm text-blue-100">
                Clasificación basada en ventas, consultas atendidas y desempeño general
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        {rankings.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* Top 3 podium — visible on md+ */}
            {rankings.length >= 1 && (
              <div className="mb-10 hidden justify-center gap-4 md:flex">
                {/* 2nd place */}
                {rankings[1] && (
                  <div className="flex flex-col items-center gap-2 pt-6">
                    <AgentAvatar
                      name={getAgent(rankings[1]).full_name}
                      avatarUrl={getAgent(rankings[1]).avatar_url}
                    />
                    <Medal className="size-6 text-gray-400" aria-hidden="true" />
                    <p className="text-xs font-semibold text-[#1f2937]">
                      {getAgent(rankings[1]).full_name}
                    </p>
                    <p className="text-xs text-gray-500">{rankings[1].score} pts</p>
                  </div>
                )}
                {/* 1st place */}
                <div className="flex flex-col items-center gap-2">
                  <AgentAvatar
                    name={getAgent(rankings[0]).full_name}
                    avatarUrl={getAgent(rankings[0]).avatar_url}
                  />
                  <Trophy className="size-7 text-yellow-500" aria-hidden="true" />
                  <p className="text-sm font-bold text-[#1f2937]">
                    {getAgent(rankings[0]).full_name}
                  </p>
                  <p className="text-xs text-gray-500">{rankings[0].score} pts</p>
                </div>
                {/* 3rd place */}
                {rankings[2] && (
                  <div className="flex flex-col items-center gap-2 pt-8">
                    <AgentAvatar
                      name={getAgent(rankings[2]).full_name}
                      avatarUrl={getAgent(rankings[2]).avatar_url}
                    />
                    <Medal className="size-5 text-orange-400" aria-hidden="true" />
                    <p className="text-xs font-semibold text-[#1f2937]">
                      {getAgent(rankings[2]).full_name}
                    </p>
                    <p className="text-xs text-gray-500">{rankings[2].score} pts</p>
                  </div>
                )}
              </div>
            )}

            {/* Table */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              <table className="w-full text-sm" aria-label="Tabla de ranking de asesores">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    <th scope="col" className="px-4 py-3 text-left">
                      Pos.
                    </th>
                    <th scope="col" className="px-4 py-3 text-left">
                      Asesor
                    </th>
                    <th scope="col" className="px-4 py-3 text-right">
                      Propiedades
                    </th>
                    <th scope="col" className="px-4 py-3 text-right">
                      Consultas
                    </th>
                    <th scope="col" className="px-4 py-3 text-right">
                      Score
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {rankings.map((entry, index) => (
                    <tr
                      key={entry.id}
                      className="transition-colors hover:bg-[#eff6ff]/40"
                    >
                      <td className="px-4 py-3">
                        <PositionBadge position={index + 1} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <AgentAvatar
                            name={getAgent(entry).full_name}
                            avatarUrl={getAgent(entry).avatar_url}
                          />
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-[#1f2937]">
                              {getAgent(entry).full_name}
                            </p>
                            {getAgent(entry).phone && (
                              <p className="text-xs text-gray-400">
                                {getAgent(entry).phone}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-[#1f2937]">
                        {entry.properties_count}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-[#1f2937]">
                        {entry.inquiries_count}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="inline-flex items-center rounded-full bg-[#eff6ff] px-2.5 py-0.5 text-xs font-bold text-[#2563eb]">
                          {entry.score} pts
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>
    </>
  );
}
