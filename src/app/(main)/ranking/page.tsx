import { type Metadata } from "next";
import Image from "next/image";
import { Trophy, Medal } from "lucide-react";

import { getAllAgentsForRanking } from "@/features/ranking/services/get-rankings";
import { RankingTable } from "@/features/ranking/components/ranking-table";
import { formatPrice } from "@/shared/lib/format";
import type { AgentRanking } from "@/features/ranking/types";

export const revalidate = 60;

function getAgent(entry: AgentRanking) {
  const a = Array.isArray(entry.agent) ? entry.agent[0] : entry.agent;
  return {
    full_name: a?.full_name ?? "Asesor",
    avatar_url: a?.avatar_url ?? null,
    phone: a?.phone ?? null,
  };
}

export const metadata: Metadata = {
  title: "Ranking de Asesores",
  description:
    "Conoce a los mejores asesores inmobiliarios de Chiclayo Propiedades, clasificados por ventas cerradas y monto total vendido.",
};

function AgentAvatar({
  name,
  avatarUrl,
  size = "md",
}: {
  name: string;
  avatarUrl: string | null;
  size?: "md" | "lg";
}) {
  const sizeClass = size === "lg" ? "size-16" : "size-10";
  const textClass = size === "lg" ? "text-xl" : "text-sm";

  if (avatarUrl) {
    return (
      <div className={`relative ${sizeClass} shrink-0 overflow-hidden rounded-full transition-transform duration-200 hover:scale-110`}>
        <Image
          src={avatarUrl}
          alt={name}
          fill
          sizes={size === "lg" ? "56px" : "40px"}
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
    <div className={`flex ${sizeClass} shrink-0 items-center justify-center rounded-full bg-[#eff6ff] ${textClass} font-bold text-[#2563eb] transition-transform duration-200 hover:scale-110`}>
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
        Sin asesores registrados
      </h2>
      <p className="max-w-sm text-sm text-gray-500">
        Aún no hay asesores activos con suscripción vigente. Vuelve pronto para
        ver el ranking actualizado.
      </p>
    </div>
  );
}

export default async function RankingPage() {
  const allAgents = await getAllAgentsForRanking();

  // Podio: solo agentes con al menos 1 venta cerrada (top 3)
  const podiumAgents = allAgents.filter((r) => r.sales_count > 0).slice(0, 3);

  return (
    <>
      {/* Page header */}
      <div className="bg-gradient-to-r from-[#0a1628] to-[#1e3a5f] py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Trophy className="size-8 text-white/70" aria-hidden="true" />
            <div>
              <h1 className="text-2xl font-bold text-white sm:text-3xl">
                Ranking de Asesores
              </h1>
              <p className="mt-0.5 text-sm text-blue-100">
                Clasificación basada en ventas cerradas y monto total vendido
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        {allAgents.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* Top 3 podium — solo agentes con ventas, visible en md+ */}
            {podiumAgents.length >= 1 && (
              <div className="mb-10 hidden justify-center gap-8 md:flex">
                {/* 2nd place */}
                {podiumAgents[1] && (
                  <div className="flex flex-col items-center gap-2 pt-6">
                    <AgentAvatar
                      name={getAgent(podiumAgents[1]).full_name}
                      avatarUrl={getAgent(podiumAgents[1]).avatar_url}
                      size="lg"
                    />
                    <Medal
                      className="size-6 text-gray-400"
                      aria-hidden="true"
                    />
                    <p className="text-[10px] font-bold text-gray-500">2do lugar</p>
                    <p className="text-xs font-semibold text-[#1f2937]">
                      {getAgent(podiumAgents[1]).full_name}
                    </p>
                    <p className="text-xs font-medium text-green-600">
                      {podiumAgents[1].sales_count} ventas
                    </p>
                  </div>
                )}
                {/* 1st place */}
                <div className="flex flex-col items-center gap-2">
                  <AgentAvatar
                    name={getAgent(podiumAgents[0]).full_name}
                    avatarUrl={getAgent(podiumAgents[0]).avatar_url}
                    size="lg"
                  />
                  <Trophy
                    className="size-7 text-yellow-500"
                    aria-hidden="true"
                  />
                  <p className="text-[10px] font-bold text-yellow-700">1er lugar</p>
                  <p className="text-sm font-bold text-[#1f2937]">
                    {getAgent(podiumAgents[0]).full_name}
                  </p>
                  <p className="text-xs font-medium text-green-600">
                    {podiumAgents[0].sales_count} ventas
                  </p>
                  {podiumAgents[0].total_sales_amount > 0 && (
                    <p className="text-xs text-gray-500">
                      {formatPrice(podiumAgents[0].total_sales_amount, "PEN")}
                    </p>
                  )}
                </div>
                {/* 3rd place */}
                {podiumAgents[2] && (
                  <div className="flex flex-col items-center gap-2 pt-8">
                    <AgentAvatar
                      name={getAgent(podiumAgents[2]).full_name}
                      avatarUrl={getAgent(podiumAgents[2]).avatar_url}
                      size="lg"
                    />
                    <Medal
                      className="size-5 text-orange-400"
                      aria-hidden="true"
                    />
                    <p className="text-[10px] font-bold text-orange-600">3er lugar</p>
                    <p className="text-xs font-semibold text-[#1f2937]">
                      {getAgent(podiumAgents[2]).full_name}
                    </p>
                    <p className="text-xs font-medium text-green-600">
                      {podiumAgents[2].sales_count} ventas
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Tabla con TODOS los agentes activos, paginada (5 por página) */}
            <RankingTable rankings={allAgents} />
          </>
        )}
      </section>
    </>
  );
}
