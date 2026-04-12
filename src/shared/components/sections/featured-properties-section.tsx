import Link from "next/link"
import { Building2, ArrowRight, Search, Plus } from "lucide-react"
import { getFeaturedProperties } from "@/features/properties/services/get-properties"
import { PropertyCard } from "@/features/properties/components/property-card"

export async function FeaturedPropertiesSection() {
  let properties: Awaited<ReturnType<typeof getFeaturedProperties>> = []
  try {
    properties = await getFeaturedProperties()
  } catch {
    // Silently fail — show empty state
  }

  return (
    <section
      className="flex min-h-svh items-center bg-[#eff6ff] py-12 sm:py-16"
      aria-labelledby="featured-heading"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-1 text-sm font-semibold uppercase tracking-wider text-[#2563eb]">
              Selección especial
            </p>
            <h2
              id="featured-heading"
              className="text-3xl font-bold text-[#1f2937] sm:text-4xl"
            >
              Propiedades Destacadas
            </h2>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-gray-600 sm:text-lg">
              Selección exclusiva de las mejores oportunidades de inversión y vivienda disponibles en este momento.
            </p>
          </div>
          <Link
            href="/propiedades"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2563eb] hover:text-[#1e40af] transition-colors"
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
          /* Empty state profesional */
          <div className="rounded-2xl border border-blue-100 bg-white p-8 sm:p-12">
            <div className="mx-auto max-w-lg text-center">
              <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl bg-[#eff6ff]">
                <Building2 className="size-8 text-[#2563eb]" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold text-[#1f2937]">
                Nuevas propiedades próximamente
              </h3>
              <p className="mt-3 text-base text-gray-500">
                Nuestros asesores están preparando las mejores propiedades para ti. Regresa pronto o regístrate como agente para publicar la tuya.
              </p>
              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <Link
                  href="/propiedades"
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#2563eb] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#1e40af] sm:w-auto"
                >
                  <Search className="size-4" aria-hidden="true" />
                  Explorar Propiedades
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#2563eb] px-6 text-sm font-semibold text-[#2563eb] transition-colors hover:bg-[#eff6ff] sm:w-auto"
                >
                  <Plus className="size-4" aria-hidden="true" />
                  Publicar Propiedad
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
