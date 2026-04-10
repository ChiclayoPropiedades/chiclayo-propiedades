import Link from "next/link"
import { ArrowRight, BookOpen, Calendar, MapPin, User } from "lucide-react"
import { createClient } from "@/shared/lib/supabase/server"

interface Training {
  id: string
  title: string
  description: string | null
  price: number
  currency: string
  modality: string | null
  start_date: string | null
  location: string | null
  instructor: string | null
  slug: string
}

async function getTrainings(): Promise<Training[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("trainings")
      .select("id, title, description, price, currency, modality, start_date, location, instructor, slug")
      .eq("is_active", true)
      .order("start_date", { ascending: true })
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
      className="bg-[#eff6ff] py-16 sm:py-20"
      aria-labelledby="trainings-heading"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="mb-1 text-sm font-semibold uppercase tracking-wider text-[#2563eb]">
              Formación profesional
            </p>
            <h2
              id="trainings-heading"
              className="text-3xl font-bold text-[#1f2937]"
            >
              Capacitaciones
            </h2>
            <p className="mt-2 max-w-xl text-base text-gray-600">
              Mejora tus habilidades y conocimientos mediante nuestros cursos y
              talleres especializados para el sector inmobiliario.
            </p>
          </div>
          <Link
            href="/capacitaciones"
            className="hidden items-center gap-1.5 text-sm font-semibold text-[#2563eb] hover:text-[#1e40af] transition-colors sm:flex"
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
                className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex flex-1 flex-col gap-3 p-5">
                  {training.modality && (
                    <span className="inline-flex w-fit items-center rounded-full bg-[#eff6ff] px-3 py-1 text-xs font-semibold text-[#2563eb]">
                      {training.modality}
                    </span>
                  )}
                  <div>
                    <p className="text-xl font-bold text-[#2563eb]">
                      {formatTrainingPrice(training.price, training.currency)}
                    </p>
                    <h3 className="mt-1 text-base font-semibold leading-snug text-[#1f2937]">
                      {training.title}
                    </h3>
                  </div>

                  {training.description && (
                    <p className="line-clamp-2 text-sm text-gray-500">
                      {training.description}
                    </p>
                  )}

                  <div className="mt-auto flex flex-col gap-1.5 text-xs text-gray-500">
                    {training.start_date && (
                      <span className="flex items-center gap-1.5">
                        <Calendar className="size-3.5 text-[#2563eb]" aria-hidden="true" />
                        {formatTrainingDate(training.start_date)}
                      </span>
                    )}
                    {training.location && (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="size-3.5 text-[#2563eb]" aria-hidden="true" />
                        {training.location}
                      </span>
                    )}
                    {training.instructor && (
                      <span className="flex items-center gap-1.5">
                        <User className="size-3.5 text-[#2563eb]" aria-hidden="true" />
                        {training.instructor}
                      </span>
                    )}
                  </div>
                </div>

                <div className="border-t border-gray-100 px-5 py-3">
                  <Link
                    href={`/capacitaciones/${training.slug}`}
                    className="flex h-9 w-full items-center justify-center rounded-lg bg-[#2563eb] text-sm font-semibold text-white transition-colors hover:bg-[#1e40af] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb]/50"
                  >
                    Más información
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <BookOpen className="size-12 text-gray-300" aria-hidden="true" />
            <p className="text-gray-500">
              No hay capacitaciones disponibles en este momento.
            </p>
            <Link
              href="/capacitaciones"
              className="text-sm font-semibold text-[#2563eb] hover:underline underline-offset-2"
            >
              Ver próximas capacitaciones
            </Link>
          </div>
        )}

        <div className="mt-6 sm:hidden">
          <Link
            href="/capacitaciones"
            className="flex items-center justify-center gap-1.5 text-sm font-semibold text-[#2563eb] hover:text-[#1e40af] transition-colors"
          >
            Ver todas las capacitaciones
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}
