import { Suspense } from "react";
import { Building2 } from "lucide-react";

import { getProperties } from "@/features/properties/services/get-properties";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { PropertiesView } from "./properties-view";

export const revalidate = 60;

export const metadata = {
  title: "Propiedades",
  description:
    "Explora miles de propiedades en venta y alquiler en Chiclayo y Lambayeque. Casas, departamentos, terrenos y mas.",
};

function ViewSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <Skeleton className="h-16 w-full rounded-xl" />
      <div className="flex flex-col gap-4">
        <Skeleton className="h-4 w-48" />
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
      </div>
    </div>
  );
}

export default async function PropertiesPage() {
  let properties: Awaited<ReturnType<typeof getProperties>> = [];
  let errorMessage: string | null = null;

  try {
    properties = await getProperties();
  } catch (err) {
    errorMessage =
      err instanceof Error
        ? err.message
        : "Error al cargar las propiedades. Por favor intenta de nuevo.";
  }

  return (
    <>
      <div className="bg-gradient-to-r from-[#0a1628] to-[#1e3a5f] py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Building2
              className="size-8 text-white/70"
              aria-hidden="true"
            />
            <div>
              <h1 className="text-2xl font-bold text-white sm:text-3xl">
                Propiedades
              </h1>
              <p className="mt-0.5 text-sm text-blue-100">
                Descubre las mejores oportunidades inmobiliarias en Chiclayo
              </p>
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {errorMessage ? (
          <div className="flex flex-col items-center gap-4 py-20 text-center">
            <Building2 className="size-12 text-gray-300" aria-hidden="true" />
            <p className="text-base font-semibold text-[#1f2937]">
              Ocurrio un error
            </p>
            <p className="text-sm text-gray-500">{errorMessage}</p>
          </div>
        ) : (
          <Suspense fallback={<ViewSkeleton />}>
            <PropertiesView allProperties={properties} />
          </Suspense>
        )}
      </main>
    </>
  );
}
