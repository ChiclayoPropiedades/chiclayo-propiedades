import Link from "next/link"
import { ArrowRight, Award } from "lucide-react"

export function RankingSection() {
  return (
    <section
      className="bg-white py-16 sm:py-20"
      aria-labelledby="ranking-heading"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="mb-1 text-sm font-semibold uppercase tracking-wider text-[#2563eb]">
              Reconocimientos
            </p>
            <h2
              id="ranking-heading"
              className="text-3xl font-bold text-[#1f2937]"
            >
              Asesores Top del Mes
            </h2>
          </div>
          <Link
            href="/ranking"
            className="flex items-center gap-1.5 text-sm font-semibold text-[#2563eb] hover:text-[#1e40af] transition-colors"
          >
            Ver ranking completo
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 py-16 text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-[#eff6ff]">
            <Award className="size-8 text-[#2563eb]" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-[#1f2937]">
              El ranking se está actualizando
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Pronto conocerás a los mejores asesores del mes.
            </p>
          </div>
          <Link
            href="/ranking"
            className="inline-flex h-9 items-center justify-center rounded-lg border border-[#2563eb] px-4 text-sm font-semibold text-[#2563eb] transition-colors hover:bg-[#eff6ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb]/50"
          >
            Ver historial
          </Link>
        </div>
      </div>
    </section>
  )
}
