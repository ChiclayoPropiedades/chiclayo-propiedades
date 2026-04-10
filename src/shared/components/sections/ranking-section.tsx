import Link from "next/link"
import { ArrowRight, Award, Trophy, Star, TrendingUp } from "lucide-react"

export function RankingSection() {
  return (
    <section
      className="bg-white py-16 sm:py-20"
      aria-labelledby="ranking-heading"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-1 text-sm font-semibold uppercase tracking-wider text-[#2563eb]">
              Reconocimientos
            </p>
            <h2
              id="ranking-heading"
              className="text-3xl font-bold text-[#1f2937] sm:text-4xl"
            >
              Asesores Top del Mes
            </h2>
            <p className="mt-2 max-w-xl text-base text-gray-600">
              Trabaja con los profesionales más destacados y mejor valorados de nuestra plataforma.
            </p>
          </div>
          <Link
            href="/ranking"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2563eb] hover:text-[#1e40af] transition-colors"
          >
            Ver ranking completo
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        {/* Empty state con 3 cards de posición */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {[
            { position: "1°", icon: Trophy, color: "from-amber-400 to-yellow-500", label: "Primer lugar", shadow: "shadow-amber-200/50" },
            { position: "2°", icon: Star, color: "from-gray-300 to-gray-400", label: "Segundo lugar", shadow: "shadow-gray-200/50" },
            { position: "3°", icon: TrendingUp, color: "from-amber-600 to-amber-700", label: "Tercer lugar", shadow: "shadow-amber-100/50" },
          ].map(({ position, icon: Icon, color, label, shadow }) => (
            <div
              key={position}
              className={`flex flex-col items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50/50 p-8 text-center shadow-sm ${shadow}`}
            >
              <div className={`flex size-14 items-center justify-center rounded-full bg-gradient-to-br ${color} text-white shadow-lg`}>
                <Icon className="size-7" aria-hidden="true" />
              </div>
              <span className="text-3xl font-bold text-[#1f2937]">{position}</span>
              <span className="text-sm font-medium text-gray-500">{label}</span>
              <div className="mt-2 h-3 w-32 rounded-full bg-gray-200">
                <div className="h-full w-0 rounded-full bg-gradient-to-r from-[#2563eb] to-blue-400 transition-all" />
              </div>
              <span className="text-xs text-gray-400">Esperando datos</span>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/ranking"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#2563eb] px-6 text-sm font-semibold text-[#2563eb] transition-colors hover:bg-[#eff6ff]"
          >
            <Award className="size-4" aria-hidden="true" />
            Ver ranking completo
          </Link>
        </div>
      </div>
    </section>
  )
}
