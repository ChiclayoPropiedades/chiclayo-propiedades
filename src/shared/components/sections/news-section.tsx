import Link from "next/link"
import { ArrowRight, TrendingUp, Lightbulb, BookOpen, FileText, Newspaper } from "lucide-react"

const topics = [
  {
    icon: TrendingUp,
    title: "Tendencias del mercado",
    description: "Análisis actualizado del mercado inmobiliario en Chiclayo y Lambayeque.",
    color: "from-[#1e3a5f] to-[#1e3a5f]",
  },
  {
    icon: Lightbulb,
    title: "Consejos de inversión",
    description: "Guías prácticas para tomar las mejores decisiones inmobiliarias.",
    color: "from-[#b8860b] to-[#d4a017]",
  },
  {
    icon: BookOpen,
    title: "Guías para compradores",
    description: "Todo lo que necesitas saber antes de comprar tu primera propiedad.",
    color: "from-[#1e3a5f] to-[#1e3a5f]",
  },
  {
    icon: FileText,
    title: "Noticias del sector",
    description: "Las últimas novedades y regulaciones del sector inmobiliario peruano.",
    color: "from-[#b8860b] to-[#d4a017]",
  },
]

export function NewsSection() {
  return (
    <section
      className="relative flex min-h-svh items-center overflow-hidden bg-white py-12 sm:py-16"
      aria-labelledby="news-heading"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-[#b8860b]">
            Blog inmobiliario
          </p>
          <h2
            id="news-heading"
            className="text-3xl font-bold text-[#1e3a5f] sm:text-4xl"
          >
            Últimas Noticias y Consejos
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-gray-600 sm:text-lg">
            Mantente al día con el mercado inmobiliario de Chiclayo y Lambayeque.
          </p>
        </div>

        {/* Topic cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {topics.map(({ icon: Icon, title, description, color }) => (
            <div
              key={title}
              className="group relative flex flex-col items-start gap-4 rounded-2xl bg-white p-6 shadow-md ring-1 ring-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              {/* Top accent */}
              <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r ${color}`} />

              <div className={`flex size-12 items-center justify-center rounded-xl bg-gradient-to-br ${color} shadow-lg`}>
                <Icon className="size-6 text-white" aria-hidden="true" />
              </div>
              <h3 className="text-base font-bold text-[#1e3a5f]">{title}</h3>
              <p className="text-sm leading-relaxed text-gray-500">{description}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <Link
            href="/blog"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#1e3a5f] px-8 text-sm font-semibold text-white shadow-lg shadow-[#1e3a5f]/20 transition-all hover:bg-[#0a1628] hover:scale-[1.02]"
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
