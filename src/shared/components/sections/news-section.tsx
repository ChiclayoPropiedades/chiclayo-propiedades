import Link from "next/link"
import { Newspaper } from "lucide-react"

export function NewsSection() {
  return (
    <section
      className="bg-white py-16 sm:py-20"
      aria-labelledby="news-heading"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <p className="mb-1 text-sm font-semibold uppercase tracking-wider text-[#2563eb]">
            Blog inmobiliario
          </p>
          <h2
            id="news-heading"
            className="text-3xl font-bold text-[#1f2937]"
          >
            Últimas Noticias y Consejos
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-base text-gray-600">
            Mantente al día con el mercado inmobiliario de Chiclayo y
            Lambayeque.
          </p>
        </div>

        <div className="flex flex-col items-center gap-4 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 py-16 text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-[#eff6ff]">
            <Newspaper className="size-8 text-[#2563eb]" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-[#1f2937]">
              Próximamente
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Estamos preparando contenido valioso para ti.
            </p>
          </div>
          <Link
            href="/blog"
            className="inline-flex h-9 items-center justify-center rounded-lg border border-[#2563eb] px-4 text-sm font-semibold text-[#2563eb] transition-colors hover:bg-[#eff6ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb]/50"
          >
            Visitar el blog
          </Link>
        </div>
      </div>
    </section>
  )
}
