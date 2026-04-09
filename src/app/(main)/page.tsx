import Link from "next/link";
import { organizationJsonLd } from "@/shared/lib/structured-data";
import {
  Building2,
  TrendingUp,
  Users,
  ArrowRight,
  PlayCircle,
  Award,
  BookOpen,
  Newspaper,
  Mail,
  MapPin,
  Calendar,
  User,
  Clock,
} from "lucide-react";

import { getFeaturedProperties } from "@/features/properties/services/get-properties";
import { PropertyCard } from "@/features/properties/components/property-card";
import { createClient } from "@/shared/lib/supabase/server";

// ─── Trainings ────────────────────────────────────────────────────────────────

interface Training {
  id: string;
  title: string;
  description: string | null;
  price: number;
  currency: string;
  modality: string | null;
  start_date: string | null;
  location: string | null;
  instructor: string | null;
  slug: string;
}

async function getTrainings(): Promise<Training[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("trainings")
      .select("id, title, description, price, currency, modality, start_date, location, instructor, slug")
      .eq("is_active", true)
      .order("start_date", { ascending: true })
      .limit(3);
    if (error) return [];
    return (data ?? []) as Training[];
  } catch {
    return [];
  }
}

function formatTrainingPrice(price: number, currency: string): string {
  const symbol = currency === "USD" ? "$" : "S/";
  return `${symbol} ${new Intl.NumberFormat("es-PE").format(price)}`;
}

function formatTrainingDate(dateStr: string | null): string {
  if (!dateStr) return "Fecha por confirmar";
  try {
    return new Intl.DateTimeFormat("es-PE", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
}

// ─── Sections ─────────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section
      className="relative min-h-[90vh] overflow-hidden flex items-center justify-center"
      aria-labelledby="hero-heading"
    >
      {/* Background image de Chiclayo */}
      <div
        className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1493882552576-fce827c6161e?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"
        aria-hidden="true"
      />
      {/* Overlay oscuro para legibilidad */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-[#1e3a8a]/85 via-[#1e40af]/80 to-[#2563eb]/75"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        {/* Logo accent */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white/80 backdrop-blur-sm">
          <Building2 className="size-4" aria-hidden="true" />
          Plataforma inmobiliaria N°1 en Chiclayo
        </div>

        <h1
          id="hero-heading"
          className="mx-auto max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl"
        >
          Encuentra el lugar perfecto para tu{" "}
          <span className="text-[#fbbf24]">próxima historia</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-blue-100">
          Conectamos tus sueños con la realidad. Miles de propiedades en venta y
          alquiler en Chiclayo y Lambayeque te esperan.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/propiedades"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 text-sm font-semibold text-[#1e40af] shadow-lg transition-all hover:bg-blue-50 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          >
            Explorar Propiedades
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
          <Link
            href="/contacto"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border-2 border-white/40 px-6 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:border-white/70 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          >
            Vender un inmueble
          </Link>
          <Link
            href="/signup"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border-2 border-white/40 px-6 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:border-white/70 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          >
            Registro de agente
          </Link>
        </div>

        {/* Stats */}
        <div className="mx-auto mt-14 grid max-w-lg grid-cols-3 gap-6 sm:max-w-2xl sm:gap-8">
          {[
            { icon: Building2, value: "500+", label: "Propiedades" },
            { icon: Users, value: "200+", label: "Agentes" },
            { icon: TrendingUp, value: "1,200+", label: "Clientes felices" },
          ].map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <Icon className="size-5 text-blue-200" aria-hidden="true" />
              <span className="text-2xl font-bold text-white">{value}</span>
              <span className="text-xs text-blue-200">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section
      className="bg-white py-16 sm:py-20"
      aria-labelledby="about-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 flex size-14 items-center justify-center rounded-full bg-[#eff6ff]">
            <Building2
              className="size-7 text-[#2563eb]"
              aria-hidden="true"
            />
          </div>
          <h2
            id="about-heading"
            className="mb-4 text-3xl font-bold text-[#1f2937]"
          >
            Conoce Chiclayo Propiedades
          </h2>
          <p className="mb-8 max-w-2xl text-base leading-relaxed text-gray-600">
            Somos la plataforma inmobiliaria más completa de Chiclayo y
            Lambayeque. Ofrecemos propiedades en venta y alquiler, capacitamos
            agentes inmobiliarios y conectamos compradores con vendedores de
            manera segura, ágil y transparente.
          </p>

          {/* Video de YouTube */}
          <div className="w-full max-w-2xl overflow-hidden rounded-2xl shadow-lg">
            <div className="aspect-video">
              <iframe
                src="https://www.youtube.com/embed/9UG8qJQE-2U"
                title="Chiclayo Propiedades - Video de presentación"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

async function FeaturedPropertiesSection() {
  let properties: Awaited<ReturnType<typeof getFeaturedProperties>> = [];
  try {
    properties = await getFeaturedProperties();
  } catch {
    // Silently fail — show empty state
  }

  return (
    <section
      className="bg-[#eff6ff] py-16 sm:py-20"
      aria-labelledby="featured-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="mb-1 text-sm font-semibold uppercase tracking-wider text-[#2563eb]">
              Selección especial
            </p>
            <h2
              id="featured-heading"
              className="text-3xl font-bold text-[#1f2937]"
            >
              Propiedades Destacadas
            </h2>
          </div>
          <Link
            href="/propiedades"
            className="flex items-center gap-1.5 text-sm font-semibold text-[#2563eb] hover:text-[#1e40af] transition-colors"
          >
            Ver todas
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        {properties.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <Building2 className="size-12 text-gray-300" aria-hidden="true" />
            <p className="text-gray-500">
              No hay propiedades destacadas en este momento.
            </p>
            <Link
              href="/propiedades"
              className="text-sm font-semibold text-[#2563eb] hover:underline underline-offset-2"
            >
              Ver todas las propiedades
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

function RankingSection() {
  return (
    <section
      className="bg-white py-16 sm:py-20"
      aria-labelledby="ranking-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
            <Award
              className="size-8 text-[#2563eb]"
              aria-hidden="true"
            />
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
  );
}

async function TrainingsSection() {
  const trainings = await getTrainings();

  return (
    <section
      className="bg-[#eff6ff] py-16 sm:py-20"
      aria-labelledby="trainings-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
                      {formatTrainingPrice(
                        training.price,
                        training.currency
                      )}
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
                        <Calendar
                          className="size-3.5 text-[#2563eb]"
                          aria-hidden="true"
                        />
                        {formatTrainingDate(training.start_date)}
                      </span>
                    )}
                    {training.location && (
                      <span className="flex items-center gap-1.5">
                        <MapPin
                          className="size-3.5 text-[#2563eb]"
                          aria-hidden="true"
                        />
                        {training.location}
                      </span>
                    )}
                    {training.instructor && (
                      <span className="flex items-center gap-1.5">
                        <User
                          className="size-3.5 text-[#2563eb]"
                          aria-hidden="true"
                        />
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
  );
}

function NewsSection() {
  return (
    <section
      className="bg-white py-16 sm:py-20"
      aria-labelledby="news-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
            <Newspaper
              className="size-8 text-[#2563eb]"
              aria-hidden="true"
            />
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
  );
}

function NewsletterSection() {
  return (
    <section
      className="bg-gradient-to-br from-[#1e3a8a] to-[#2563eb] py-16 sm:py-20"
      aria-labelledby="newsletter-heading"
    >
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <div className="mb-4 flex justify-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-white/10">
            <Mail className="size-6 text-white" aria-hidden="true" />
          </div>
        </div>
        <h2
          id="newsletter-heading"
          className="text-3xl font-bold text-white"
        >
          No te pierdas ninguna oportunidad
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-base text-blue-100">
          Suscríbete y recibe las mejores propiedades, noticias y consejos
          inmobiliarios directamente en tu correo.
        </p>

        <form
          action="#"
          className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
          aria-label="Suscripción al newsletter"
        >
          <input
            type="email"
            name="email"
            required
            placeholder="Tu correo electrónico"
            className="h-12 flex-1 rounded-xl border border-white/20 bg-white/10 px-4 text-sm text-white placeholder:text-blue-200 outline-none backdrop-blur-sm transition-colors focus:border-white/50 focus:bg-white/20 focus:ring-2 focus:ring-white/20"
            aria-label="Correo electrónico para suscripción"
          />
          <button
            type="submit"
            className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-6 text-sm font-semibold text-[#1e40af] shadow-lg transition-all hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          >
            <Clock className="size-4" aria-hidden="true" />
            Suscribirme
          </button>
        </form>

        <p className="mt-4 text-xs text-blue-200">
          Sin spam. Puedes cancelar en cualquier momento.
        </p>
      </div>
    </section>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default async function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
      />
      <HeroSection />
      <AboutSection />
      <FeaturedPropertiesSection />
      <RankingSection />
      <TrainingsSection />
      <NewsSection />
      <NewsletterSection />
    </>
  );
}
