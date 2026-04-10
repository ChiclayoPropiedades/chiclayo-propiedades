import Link from "next/link"
import { Newspaper, ArrowRight, BookOpen, TrendingUp, Lightbulb } from "lucide-react"

const topics = [
  {
    icon: TrendingUp,
    title: "Tendencias del mercado",
    description: "Análisis del mercado inmobiliario en Chiclayo y Lambayeque.",
  },
  {
    icon: Lightbulb,
    title: "Consejos de inversión",
    description: "Guías para tomar las mejores decisiones inmobiliarias.",
  },
  {
    icon: BookOpen,
    title: "Guías para compradores",
    description: "Todo lo que necesitas saber antes de comprar tu propiedad.",
  },
]

export function NewsSection() {
  return (
    <section
      className="bg-white py-16 sm:py-20"
      aria-labelledby="news-heading"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <p className="mb-1 text-sm font-semibold uppercase tracking-wider text-[#2563eb]">
            Blog inmobiliario
          </p>
          <h2
            id="news-heading"
            className="text-3xl font-bold text-[#1f2937] sm:text-4xl"
          >
            Últimas Noticias y Consejos
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-base text-gray-600">
            Mantente al día con el mercado inmobiliario de Chiclayo y Lambayeque.
          </p>
        </div>

        {/* Topic cards en vez de empty state vacío */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {topics.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="group flex flex-col items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50/50 p-8 text-center transition-all hover:border-blue-100 hover:bg-[#eff6ff]/50 hover:shadow-sm"
            >
              <div className="flex size-12 items-center justify-center rounded-xl bg-[#eff6ff] transition-colors group-hover:bg-[#2563eb]/10">
                <Icon className="size-6 text-[#2563eb]" aria-hidden="true" />
              </div>
              <h3 className="text-base font-semibold text-[#1f2937]">{title}</h3>
              <p className="text-sm text-gray-500">{description}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/blog"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#2563eb] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#1e40af]"
          >
            <Newspaper className="size-4" aria-hidden="true" />
            Visitar el Blog
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}
