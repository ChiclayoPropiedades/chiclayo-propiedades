"use client";

import { useState } from "react";
import Image from "next/image";
import { TrendingUp, DollarSign, Home, ChevronLeft, ChevronRight } from "lucide-react";

import { formatPrice } from "@/shared/lib/format";
import type { AgentRanking } from "@/features/ranking/types";

const PAGE_SIZE = 5;

function getAgent(entry: AgentRanking) {
  const a = Array.isArray(entry.agent) ? entry.agent[0] : entry.agent;
  return {
    full_name: a?.full_name ?? "Asesor",
    avatar_url: a?.avatar_url ?? null,
    phone: a?.phone ?? null,
  };
}

function PositionBadge({ position }: { position: number }) {
  if (position === 1) {
    return (
      <div className="flex flex-col items-center">
        <span className="flex size-10 items-center justify-center rounded-full bg-yellow-400 text-lg font-extrabold text-yellow-900 shadow-md">1</span>
        <span className="mt-0.5 text-[10px] font-bold text-yellow-700">1er lugar</span>
      </div>
    );
  }
  if (position === 2) {
    return (
      <div className="flex flex-col items-center">
        <span className="flex size-10 items-center justify-center rounded-full bg-gray-300 text-lg font-extrabold text-gray-700 shadow-md">2</span>
        <span className="mt-0.5 text-[10px] font-bold text-gray-500">2do lugar</span>
      </div>
    );
  }
  if (position === 3) {
    return (
      <div className="flex flex-col items-center">
        <span className="flex size-10 items-center justify-center rounded-full bg-orange-300 text-lg font-extrabold text-orange-900 shadow-md">3</span>
        <span className="mt-0.5 text-[10px] font-bold text-orange-600">3er lugar</span>
      </div>
    );
  }
  return (
    <span className="flex size-8 items-center justify-center rounded-full bg-gray-100 text-sm font-extrabold text-gray-600">
      {position}
    </span>
  );
}

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

export function RankingTable({ rankings }: { rankings: AgentRanking[] }) {
  const [page, setPage] = useState(0);

  const totalPages = Math.max(1, Math.ceil(rankings.length / PAGE_SIZE));
  const paginated = rankings.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table
          className="w-full text-sm"
          aria-label="Tabla de ranking de asesores"
        >
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-500">
              <th scope="col" className="px-4 py-3 text-left">
                Pos.
              </th>
              <th scope="col" className="px-4 py-3 text-left">
                Asesor
              </th>
              <th scope="col" className="px-4 py-3 text-center">
                <span className="inline-flex items-center gap-1">
                  <TrendingUp className="size-3" />
                  Ventas
                </span>
              </th>
              <th
                scope="col"
                className="hidden px-4 py-3 text-right sm:table-cell"
              >
                <span className="inline-flex items-center gap-1">
                  <DollarSign className="size-3" />
                  Monto vendido
                </span>
              </th>
              <th
                scope="col"
                className="hidden px-4 py-3 text-right md:table-cell"
              >
                <span className="inline-flex items-center gap-1">
                  <Home className="size-3" />
                  Propiedades
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginated.map((entry, index) => {
              const pos = page * PAGE_SIZE + index + 1;
              const rowBg =
                pos === 1
                  ? "bg-yellow-50/60"
                  : pos === 2
                    ? "bg-gray-50/60"
                    : pos === 3
                      ? "bg-orange-50/40"
                      : "";
              return (
                <tr
                  key={entry.id}
                  className={`transition-colors hover:bg-[#eff6ff]/40 ${rowBg}`}
                >
                  <td className="px-4 py-3">
                    <PositionBadge position={pos} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <AgentAvatar
                        name={getAgent(entry).full_name}
                        avatarUrl={getAgent(entry).avatar_url}
                        size={pos <= 3 ? "lg" : "md"}
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
                  <td className="px-4 py-3 text-center font-bold text-green-700">
                    {entry.sales_count}
                  </td>
                  <td className="hidden px-4 py-3 text-right font-medium text-[#1f2937] sm:table-cell">
                    {entry.total_sales_amount > 0
                      ? formatPrice(entry.total_sales_amount, "PEN")
                      : "—"}
                  </td>
                  <td className="hidden px-4 py-3 text-right text-gray-500 md:table-cell">
                    {entry.properties_count}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-100 pt-3">
          <p className="text-xs text-gray-500">
            Página {page + 1} de {totalPages} ({rankings.length} asesores)
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              aria-label="Página anterior"
              className="rounded-md border border-gray-200 p-1.5 text-gray-500 hover:bg-gray-50 disabled:opacity-30"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              aria-label="Página siguiente"
              className="rounded-md border border-gray-200 p-1.5 text-gray-500 hover:bg-gray-50 disabled:opacity-30"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
