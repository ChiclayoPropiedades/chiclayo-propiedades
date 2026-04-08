import { Home } from "lucide-react";

import { Property } from "../types";
import { PropertyCard } from "./property-card";

interface PropertyGridProps {
  properties: Property[];
}

function EmptyState() {
  return (
    <div className="col-span-full flex flex-col items-center justify-center gap-4 py-20 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-[#eff6ff]">
        <Home className="size-8 text-[#2563eb]" aria-hidden="true" />
      </div>
      <div>
        <h3 className="text-base font-semibold text-[#1f2937]">
          No se encontraron propiedades
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Intenta ajustar los filtros de búsqueda.
        </p>
      </div>
    </div>
  );
}

export function PropertyGrid({ properties }: PropertyGridProps) {
  if (properties.length === 0) {
    return (
      <div className="grid grid-cols-1">
        <EmptyState />
      </div>
    );
  }

  return (
    <div
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      aria-label={`${properties.length} propiedades encontradas`}
    >
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}
