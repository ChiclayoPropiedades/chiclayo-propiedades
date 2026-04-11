import { Suspense } from "react";
import { Building2 } from "lucide-react";

import { getProperties } from "@/features/properties/services/get-properties";
import { PropertyGrid } from "@/features/properties/components/property-grid";
import { PropertyFilters } from "@/features/properties/components/property-filters";
import { Skeleton } from "@/shared/components/ui/skeleton";
import type { PropertyFilters as PropertyFiltersType } from "@/features/properties/types";

export const revalidate = 60;

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function GridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-xl border border-gray-200 bg-white"
        >
          <Skeleton className="h-48 w-full rounded-none" />
          <div className="flex flex-col gap-2 p-4">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="mt-1 h-6 w-28" />
          </div>
          <div className="flex gap-4 border-t border-gray-100 px-4 py-3">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}

async function PropertiesContent({
  filters,
}: {
  filters: PropertyFiltersType;
}) {
  let properties: Awaited<ReturnType<typeof getProperties>> = [];
  let errorMessage: string | null = null;

  try {
    properties = await getProperties(filters);
  } catch (err) {
    errorMessage =
      err instanceof Error
        ? err.message
        : "Error al cargar las propiedades. Por favor intenta de nuevo.";
  }

  if (errorMessage) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <Building2 className="size-12 text-gray-300" aria-hidden="true" />
        <p className="text-base font-semibold text-[#1f2937]">
          Ocurrió un error
        </p>
        <p className="text-sm text-gray-500">{errorMessage}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-gray-500" aria-live="polite">
        {properties.length === 0
          ? "No se encontraron propiedades con los filtros seleccionados."
          : `${properties.length} propiedad${properties.length !== 1 ? "es" : ""} encontrada${properties.length !== 1 ? "s" : ""}`}
      </p>
      <PropertyGrid properties={properties} />
    </div>
  );
}

export default async function PropertiesPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const getString = (key: string): string | undefined => {
    const val = params[key];
    if (Array.isArray(val)) return val[0];
    return val;
  };

  const filters: PropertyFiltersType = {};

  const search = getString("search");
  if (search) filters.search = search;

  const operation = getString("operation");
  if (operation === "venta" || operation === "alquiler") {
    filters.operation = operation;
  }

  const type = getString("type");
  if (type) filters.type = type;

  const minPrice = getString("minPrice");
  if (minPrice) filters.minPrice = parseInt(minPrice, 10);

  const maxPrice = getString("maxPrice");
  if (maxPrice) filters.maxPrice = parseInt(maxPrice, 10);

  const district = getString("district");
  if (district) filters.district = district;

  const operationTitle =
    filters.operation === "alquiler"
      ? "Propiedades en Alquiler"
      : "Propiedades en Venta";

  const subtitle =
    filters.operation === "alquiler"
      ? "Encuentra las mejores propiedades en alquiler en Chiclayo"
      : "Descubre las mejores oportunidades inmobiliarias en Chiclayo";

  return (
    <>
      {/* Page header */}
      <div className="bg-gradient-to-r from-[#1e3a8a] to-[#2563eb] py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Building2
              className="size-8 text-white/70"
              aria-hidden="true"
            />
            <div>
              <h1 className="text-2xl font-bold text-white sm:text-3xl">
                {operationTitle}
              </h1>
              <p className="mt-0.5 text-sm text-blue-100">{subtitle}</p>
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6">
          {/* Filters — client component with useSearchParams */}
          <Suspense
            fallback={
              <Skeleton className="h-16 w-full rounded-xl" />
            }
          >
            <PropertyFilters />
          </Suspense>

          {/* Properties grid — server component */}
          <Suspense fallback={<GridSkeleton />}>
            <PropertiesContent filters={filters} />
          </Suspense>
        </div>
      </main>
    </>
  );
}

export const metadata = {
  title: "Propiedades",
  description:
    "Explora miles de propiedades en venta y alquiler en Chiclayo y Lambayeque. Casas, departamentos, terrenos y más.",
};
