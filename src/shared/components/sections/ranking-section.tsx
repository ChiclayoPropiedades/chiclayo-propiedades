import Link from "next/link"
import { ArrowRight, Award, Trophy, Medal, Crown } from "lucide-react"

export function RankingSection() {
  return (
    <section
      className="relative flex min-h-svh items-center overflow-hidden bg-gradient-to-br from-[#1e3a5f] to-[#0f1f33] py-12 sm:py-16"
      aria-labelledby="ranking-heading"
    >
      {/* Decorative */}
      <div className="absolute -top-32 -right-32 h-64 w-64 rounded-full bg-[#b8860b]/10 blur-3xl" aria-hidden="true" />
      <div className="absolute -bottom-32 -left-32 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" aria-hidden="true" />

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
            <p className="mt-2 max-w-xl text-base text-blue-200/80">
              Trabaja con los profesionales más destacados y mejor valorados de nuestra plataforma.
            </p>
          </div>
          <Link
            href="/ranking"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#b8860b] hover:text-amber-400 transition-colors"
          >
            Ver ranking completo
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        {/* Podium cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {/* 1er lugar */}
          <div className="group relative flex flex-col items-center gap-4 rounded-2xl border border-[#b8860b]/30 bg-gradient-to-b from-[#b8860b]/10 to-transparent p-8 text-center backdrop-blur-sm transition-all hover:border-[#b8860b]/50 hover:shadow-lg hover:shadow-[#b8860b]/10 sm:order-2 sm:-mt-4">
            <div className="absolute -top-px left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r from-transparent via-[#b8860b] to-transparent" />
            <div className="flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-[#b8860b] to-[#d4a017] shadow-lg shadow-[#b8860b]/30">
              <Crown className="size-8 text-white" aria-hidden="true" />
            </div>
            <span className="text-4xl font-black text-[#b8860b]">1°</span>
            <span className="text-sm font-semibold text-white">Primer lugar</span>
            <div className="h-2 w-32 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-[#b8860b] to-[#d4a017] animate-pulse" />
            </div>
            <span className="text-xs text-blue-200/60">Próximamente</span>
          </div>

          {/* 2do lugar */}
          <div className="group flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10 sm:order-1">
            <div className="flex size-14 items-center justify-center rounded-full bg-gradient-to-br from-gray-300 to-gray-400 shadow-lg">
              <Medal className="size-7 text-white" aria-hidden="true" />
            </div>
            <span className="text-3xl font-black text-gray-300">2°</span>
            <span className="text-sm font-semibold text-white/80">Segundo lugar</span>
            <div className="h-2 w-28 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-1/2 rounded-full bg-gray-400 animate-pulse" />
            </div>
            <span className="text-xs text-blue-200/60">Próximamente</span>
          </div>

          {/* 3er lugar */}
          <div className="group flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10 sm:order-3">
            <div className="flex size-14 items-center justify-center rounded-full bg-gradient-to-br from-amber-700 to-amber-800 shadow-lg">
              <Trophy className="size-7 text-white" aria-hidden="true" />
            </div>
            <span className="text-3xl font-black text-amber-700">3°</span>
            <span className="text-sm font-semibold text-white/80">Tercer lugar</span>
            <div className="h-2 w-24 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-1/3 rounded-full bg-amber-700 animate-pulse" />
            </div>
            <span className="text-xs text-blue-200/60">Próximamente</span>
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/ranking"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#b8860b] px-6 text-sm font-semibold text-white shadow-lg shadow-[#b8860b]/20 transition-all hover:bg-[#d4a017] hover:scale-[1.02]"
          >
            <Award className="size-4" aria-hidden="true" />
            Ver ranking completo
          </Link>
        </div>
      </div>
    </section>
  )
}
