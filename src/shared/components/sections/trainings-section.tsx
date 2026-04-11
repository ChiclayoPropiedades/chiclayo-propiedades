import Link from "next/link"
import { ArrowRight, BookOpen, Calendar, MapPin, User, GraduationCap, Clock } from "lucide-react"
import { createPublicClient } from "@/shared/lib/supabase/server"

interface Training {
  id: string
  title: string
  description: string | null
  price: number
  currency: string
  modality: string | null
  event_date: string | null
  location: string | null
  instructor: string | null
  cover_image: string | null
  slug: string
}

async function getTrainings(): Promise<Training[]> {
  try {
    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from("trainings")
      .select("id, title, description, price, currency, modality, event_date, location, instructor, cover_image, slug")
      .eq("is_active", true)
      .order("event_date", { ascending: true })
      .limit(3)
    if (error) return []
    return (data ?? []) as Training[]
  } catch {
    return []
  }
}

function formatTrainingPrice(price: number, currency: string): string {
  const symbol = currency === "USD" ? "$" : "S/"
  return `${symbol} ${new Intl.NumberFormat("es-PE").format(price)}`
}

function formatTrainingDate(dateStr: string | null): string {
  if (!dateStr) return "Fecha por confirmar"
  try {
    return new Intl.DateTimeFormat("es-PE", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date(dateStr))
  } catch {
    return dateStr
  }
}

export async function TrainingsSection() {
  const trainings = await getTrainings()

  return (
    <section
      className="flex min-h-svh items-center bg-gradient-to-b from-[#0a1628] to-[#1e3a5f] py-12 sm:py-16"
      aria-labelledby="trainings-heading"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-1 text-sm font-semibold uppercase tracking-wider text-[#b8860b]">
              Formación profesional
            </p>
            <h2
              id="trainings-heading"
              className="text-3xl font-bold text-white sm:text-4xl"
            >
              Capacitaciones
            </h2>
            <p className="mt-2 max-w-xl text-base text-gray-300">
              Mejora tus habilidades y conocimientos mediante nuestros cursos y
              talleres especializados para el sector inmobiliario.
            </p>
          </div>
          <Link
            href="/capacitaciones"
            className="hidden items-center gap-1.5 text-sm font-semibold text-white hover:text-[#b8860b] transition-colors sm:inline-flex"
          >
            Ver todas
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        {trainings.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {trainings.map((training) => (
              <article
                key={training.id}
                className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                {/* Top accent line */}
                <div className="h-1 bg-gradient-to-r from-[#1e3a5f] via-[#b8860b] to-[#1e3a5f]" />

                <div className="flex flex-1 flex-col gap-4 p-6">
                  {/* Modality + Price row */}
                  <div className="flex items-center justify-between">
                    {training.modality && (
                      <span className={`inline-flex items-center rounded-lg px-3 py-1 text-xs font-semibold ${
                        training.modality.toLowerCase() === "presencial"
                          ? "bg-[#1e3a5f] text-white"
                          : "bg-[#b8860b]/10 text-[#b8860b] ring-1 ring-[#b8860b]/20"
                      }`}>
                        {training.modality}
                      </span>
                    )}
                    <p className="text-xl font-bold text-[#b8860b]">
                      {formatTrainingPrice(training.price, training.currency)}
                    </p>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold leading-snug text-[#1f2937] transition-colors group-hover:text-[#1e3a5f]">
                    {training.title}
                  </h3>

                  {/* Description */}
                  {training.description && (
                    <p className="line-clamp-2 text-sm text-gray-500">
                      {training.description}
                    </p>
                  )}

                  {/* Details */}
                  <div className="mt-auto flex flex-col gap-2 border-t border-gray-100 pt-4 text-sm text-gray-600">
                    {training.event_date && (
                      <span className="flex items-center gap-2">
                        <Calendar className="size-4 text-[#1e3a5f]" aria-hidden="true" />
                        {formatTrainingDate(training.event_date)}
                      </span>
                    )}
                    {training.location && (
                      <span className="flex items-center gap-2">
                        <MapPin className="size-4 text-[#1e3a5f]" aria-hidden="true" />
                        {training.location}
                      </span>
                    )}
                    {training.instructor && (
                      <span className="flex items-center gap-2">
                        <User className="size-4 text-[#1e3a5f]" aria-hidden="true" />
                        {training.instructor}
                      </span>
                    )}
                  </div>
                </div>

                {/* CTA */}
                <div className="px-6 pb-6">
                  <Link
                    href={`/capacitaciones/${training.slug}`}
                    className="flex h-11 w-full items-center justify-center rounded-xl bg-[#1e3a5f] text-sm font-semibold text-white transition-all hover:bg-[#0f1f33] hover:shadow-lg"
                  >
                    Más información
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          /* Empty state profesional */
          <div className="rounded-2xl border border-gray-100 bg-white p-8 sm:p-12">
            <div className="mx-auto max-w-lg text-center">
              <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl bg-[#1e3a5f]/5">
                <GraduationCap className="size-8 text-[#1e3a5f]" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold text-[#1f2937]">
                Nuevas capacitaciones próximamente
              </h3>
              <p className="mt-3 text-base text-gray-500">
                Estamos preparando cursos y talleres especializados para impulsar tu carrera en el sector inmobiliario.
              </p>
              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {[
                  { icon: GraduationCap, text: "Cursos certificados" },
                  { icon: Clock, text: "Modalidad flexible" },
                  { icon: User, text: "Instructores expertos" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex flex-col items-center gap-2 rounded-xl bg-[#f8fafc] p-4">
                    <Icon className="size-5 text-[#b8860b]" aria-hidden="true" />
                    <span className="text-xs font-medium text-gray-600">{text}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Link
                  href="/capacitaciones"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#1e3a5f] px-6 text-sm font-semibold text-white transition-all hover:bg-[#0f1f33]"
                >
                  <BookOpen className="size-4" aria-hidden="true" />
                  Ver capacitaciones
                </Link>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 sm:hidden">
          <Link
            href="/capacitaciones"
            className="flex items-center justify-center gap-1.5 text-sm font-semibold text-[#1e3a5f] hover:text-[#b8860b] transition-colors"
          >
            Ver todas las capacitaciones
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}
