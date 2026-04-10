import Link from "next/link"
import { Building2, ArrowRight } from "lucide-react"
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
      className="bg-[#eff6ff] py-16 sm:py-20"
      aria-labelledby="featured-heading"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
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
  )
}
