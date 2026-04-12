import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Award, Trophy, Medal, Crown } from "lucide-react";
import { getRankings } from "@/features/ranking/services/get-rankings";
import { formatPrice } from "@/shared/lib/format";
import type { AgentRanking } from "@/features/ranking/types";

function getAgent(entry: AgentRanking) {
  const a = Array.isArray(entry.agent) ? entry.agent[0] : entry.agent;
  return {
    full_name: a?.full_name ?? "Asesor",
    avatar_url: a?.avatar_url ?? null,
  };
}

function PodiumCard({
  entry,
  position,
}: {
  entry: AgentRanking | undefined;
  position: 1 | 2 | 3;
}) {
  const configs = {
    1: {
      icon: Crown,
      iconSize: "size-8",
      circleSize: "size-16",
      circleGradient: "from-[#b8860b] to-[#d4a017]",
      shadow: "shadow-[#b8860b]/30",
      posSize: "text-4xl",
      posColor: "text-[#b8860b]",
      border: "border-[#b8860b]/30 hover:border-[#b8860b]/50",
      bg: "bg-gradient-to-b from-[#b8860b]/10 to-transparent",
      order: "sm:order-2 sm:-mt-4",
      barWidth: "w-3/4",
      barColor: "from-[#b8860b] to-[#d4a017]",
      label: "Primer lugar",
      topLine: true,
    },
    2: {
      icon: Medal,
      iconSize: "size-7",
      circleSize: "size-14",
      circleGradient: "from-gray-300 to-gray-400",
      shadow: "",
      posSize: "text-3xl",
      posColor: "text-gray-300",
      border: "border-white/10 hover:border-white/20",
      bg: "bg-white/5 hover:bg-white/10",
      order: "sm:order-1",
      barWidth: "w-1/2",
      barColor: "from-gray-400 to-gray-400",
      label: "Segundo lugar",
      topLine: false,
    },
    3: {
      icon: Trophy,
      iconSize: "size-7",
      circleSize: "size-14",
      circleGradient: "from-amber-700 to-amber-800",
      shadow: "",
      posSize: "text-3xl",
      posColor: "text-amber-700",
      border: "border-white/10 hover:border-white/20",
      bg: "bg-white/5 hover:bg-white/10",
      order: "sm:order-3",
      barWidth: "w-1/3",
      barColor: "from-amber-700 to-amber-700",
      label: "Tercer lugar",
      topLine: false,
    },
  };

  const c = configs[position];
  const Icon = c.icon;

  return (
    <div
      className={`group relative flex flex-col items-center gap-4 rounded-2xl border p-8 text-center backdrop-blur-sm transition-all ${c.border} ${c.bg} ${c.order}`}
    >
      {c.topLine && (
        <div className="absolute -top-px left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r from-transparent via-[#b8860b] to-transparent" />
      )}
      {/* Avatar del agente */}
      {entry && getAgent(entry).avatar_url ? (
        <div className="relative size-16 overflow-hidden rounded-full border-2 border-white/30 shadow-lg">
          <Image
            src={getAgent(entry).avatar_url!}
            alt={getAgent(entry).full_name}
            fill
            sizes="64px"
            className="object-cover"
          />
        </div>
      ) : (
        entry ? (
          <div className="flex size-16 items-center justify-center rounded-full bg-white/10 text-xl font-bold text-white border-2 border-white/30">
            {getAgent(entry).full_name.charAt(0).toUpperCase()}
          </div>
        ) : null
      )}
      <div
        className={`flex ${c.circleSize} items-center justify-center rounded-full bg-gradient-to-br ${c.circleGradient} shadow-lg ${c.shadow}`}
      >
        <Icon className={`${c.iconSize} text-white`} aria-hidden="true" />
      </div>
      <span className={`${c.posSize} font-black ${c.posColor}`}>
        {position}°
      </span>
      {entry ? (
        <>
          <span className="text-sm font-semibold text-white">
            {getAgent(entry).full_name}
          </span>
          {entry.sales_count > 0 ? (
            <span className="text-xs font-medium text-green-400">
              {entry.sales_count} {entry.sales_count === 1 ? "venta" : "ventas"} cerrada{entry.sales_count === 1 ? "" : "s"}
            </span>
          ) : (
            <span className="text-xs text-blue-200/60">Sin ventas aún</span>
          )}
          {entry.total_sales_amount > 0 && (
            <span className="text-xs text-blue-200/80">
              {formatPrice(entry.total_sales_amount, "PEN")}
            </span>
          )}
        </>
      ) : (
        <>
          <span className="text-sm font-semibold text-white/80">{c.label}</span>
          <span className="text-xs text-blue-200/60">Próximamente</span>
        </>
      )}
    </div>
  );
}

export async function RankingSection() {
  const rankings = await getRankings();

  return (
    <section
      className="relative flex min-h-svh items-center overflow-hidden bg-gradient-to-br from-[#1e3a5f] to-[#0a1628] py-12 sm:py-16"
      aria-labelledby="ranking-heading"
    >
      {/* Decorative */}
      <div
        className="absolute -top-32 -right-32 h-64 w-64 rounded-full bg-[#b8860b]/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-32 -left-32 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-1 text-sm font-semibold uppercase tracking-wider text-[#b8860b]">
              Reconocimientos
            </p>
            <h2
              id="ranking-heading"
              className="text-3xl font-bold text-white sm:text-4xl"
            >
              Asesores Top del Mes
            </h2>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-blue-200/80 sm:text-lg">
              Clasificación basada en ventas cerradas y monto total vendido.
              Trabaja con los mejores profesionales.
            </p>
          </div>
          <Link
            href="/ranking"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#b8860b] transition-colors hover:text-amber-400"
          >
            Ver ranking completo
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        {/* Podium cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <PodiumCard entry={rankings[1]} position={2} />
          <PodiumCard entry={rankings[0]} position={1} />
          <PodiumCard entry={rankings[2]} position={3} />
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/ranking"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#b8860b] px-6 text-sm font-semibold text-white shadow-lg shadow-[#b8860b]/20 transition-all hover:scale-[1.02] hover:bg-[#d4a017]"
          >
            <Award className="size-4" aria-hidden="true" />
            Ver ranking completo
          </Link>
        </div>
      </div>
    </section>
  );
}
